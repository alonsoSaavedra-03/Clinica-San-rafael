<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

/**
 * Controlador de Gestión de Citas Médicas.
 * Soporta CRUD completo con validación de traslape y control por roles.
 */
class AppointmentController extends Controller
{
    /**
     * Listar citas con filtros según el rol del usuario autenticado.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Appointment::with([
            'patient:id,name,email,phone,dni',
            'doctor.user:id,name',
            'doctor.specialty:id,name',
            'specialty:id,name'
        ]);

        // Filtrado por rol
        if ($user->role === 'paciente') {
            $query->where('patient_id', $user->id);
        } elseif ($user->role === 'medico') {
            $doctor = $user->doctorProfile;
            if (!$doctor) {
                return response()->json(['success' => false, 'message' => 'Perfil médico no asociado.'], 403);
            }
            $query->where('doctor_id', $doctor->id);
        }
        // Rol 'administrador' puede ver todas las citas

        // Filtro por estado
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // Filtro por fecha específica
        if ($request->has('date') && $request->date) {
            $query->whereDate('appointment_date', $request->date);
        }

        $appointments = $query->orderBy('appointment_date', 'desc')
                              ->orderBy('appointment_time', 'asc')
                              ->get();

        return response()->json([
            'success' => true,
            'data'    => $appointments
        ]);
    }

    /**
     * Reservar una nueva cita médica.
     */
    public function store(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'doctor_id'        => 'required|exists:doctors,id',
            'specialty_id'     => 'required|exists:specialties,id',
            'appointment_date' => 'required|date|after_or_equal:today',
            'appointment_time' => 'required|string',
            'reason'           => 'required|string|max:500',
        ]);

        // Solo pacientes (o admin para un paciente dado) pueden crear citas
        $patientId = $user->role === 'administrador' && $request->has('patient_id')
            ? $request->patient_id
            : $user->id;

        // Verificar colisión horaria: el médico no debe tener ya una cita activa en esa hora
        $exists = Appointment::where('doctor_id', $request->doctor_id)
            ->whereDate('appointment_date', $request->appointment_date)
            ->where('appointment_time', $request->appointment_time)
            ->whereIn('status', ['pendiente', 'confirmada'])
            ->exists();

        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'El horario seleccionado ya ha sido reservado por otro paciente. Por favor elija otro turno.'
            ], 409);
        }

        // Crear la cita en estado 'confirmada' automáticamente por política del sistema
        $appointment = Appointment::create([
            'patient_id'        => $patientId,
            'doctor_id'         => $request->doctor_id,
            'specialty_id'      => $request->specialty_id,
            'appointment_date'  => $request->appointment_date,
            'appointment_time'  => $request->appointment_time,
            'reason'            => $request->reason,
            'status'            => 'confirmada',
            'confirmation_code' => Appointment::generateCode(),
        ]);

        $appointment->load(['patient', 'doctor.user', 'specialty']);

        return response()->json([
            'success' => true,
            'message' => '¡Su cita ha sido confirmada con éxito!',
            'data'    => $appointment
        ], 201);
    }

    /**
     * Consultar detalle de una cita.
     */
    public function show(Request $request, $id)
    {
        $user = $request->user();
        $appointment = Appointment::with(['patient', 'doctor.user', 'specialty'])->findOrFail($id);

        // Control de autorización
        if ($user->role === 'paciente' && $appointment->patient_id !== $user->id) {
            return response()->json(['success' => false, 'message' => 'No autorizado.'], 403);
        }

        if ($user->role === 'medico' && $appointment->doctor_id !== $user->doctorProfile->id) {
            return response()->json(['success' => false, 'message' => 'No autorizado.'], 403);
        }

        return response()->json(['success' => true, 'data' => $appointment]);
    }

    /**
     * Modificar/reprogramar cita.
     */
    public function update(Request $request, $id)
    {
        $appointment = Appointment::findOrFail($id);

        $request->validate([
            'appointment_date' => 'sometimes|date|after_or_equal:today',
            'appointment_time' => 'sometimes|string',
            'reason'           => 'sometimes|string|max:500',
        ]);

        // Si se cambia la fecha u hora, comprobar disponibilidad
        if ($request->has('appointment_date') || $request->has('appointment_time')) {
            $newDate = $request->input('appointment_date', $appointment->appointment_date->toDateString());
            $newTime = $request->input('appointment_time', $appointment->appointment_time);

            $collision = Appointment::where('doctor_id', $appointment->doctor_id)
                ->whereDate('appointment_date', $newDate)
                ->where('appointment_time', $newTime)
                ->where('id', '!=', $appointment->id)
                ->whereIn('status', ['pendiente', 'confirmada'])
                ->exists();

            if ($collision) {
                return response()->json([
                    'success' => false,
                    'message' => 'El horario solicitado no está disponible.'
                ], 409);
            }
        }

        $appointment->update($request->only(['appointment_date', 'appointment_time', 'reason']));

        return response()->json([
            'success' => true,
            'message' => 'Cita médica actualizada correctamente.',
            'data'    => $appointment->fresh(['patient', 'doctor.user', 'specialty'])
        ]);
    }

    /**
     * Cancelar una cita médica con motivo obligatorio.
     */
    public function cancel(Request $request, $id)
    {
        $user = $request->user();
        $appointment = Appointment::findOrFail($id);

        if ($appointment->status === 'cancelada') {
            return response()->json(['success' => false, 'message' => 'La cita ya fue cancelada.'], 400);
        }

        if ($appointment->status === 'atendida') {
            return response()->json(['success' => false, 'message' => 'No se puede cancelar una cita ya atendida.'], 400);
        }

        $request->validate([
            'reason' => 'required|string|min:5|max:300',
        ]);

        $appointment->update([
            'status'              => 'cancelada',
            'cancellation_reason' => $request->reason,
            'cancelled_by'        => $user->role,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'La cita fue cancelada exitosamente.',
            'data'    => $appointment
        ]);
    }

    /**
     * Médico: Marcar cita como atendida y registrar notas clínicas.
     */
    public function attend(Request $request, $id)
    {
        $user = $request->user();
        $appointment = Appointment::findOrFail($id);

        if ($user->role !== 'medico' && $user->role !== 'administrador') {
            return response()->json(['success' => false, 'message' => 'Acción exclusiva para personal médico.'], 403);
        }

        $request->validate([
            'clinical_notes' => 'required|string|min:10',
        ]);

        $appointment->update([
            'status'         => 'atendida',
            'clinical_notes' => $request->clinical_notes,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Atención registrada con éxito en el historial clínico.',
            'data'    => $appointment
        ]);
    }
}
