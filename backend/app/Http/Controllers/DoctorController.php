<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use App\Models\DoctorSchedule;
use App\Models\Appointment;
use App\Models\Specialty;
use Illuminate\Http\Request;
use Carbon\Carbon;

/**
 * Controlador de Médicos y Horarios de Atención.
 * Calcula disponibilidad en tiempo real para agendamiento de citas.
 */
class DoctorController extends Controller
{
    /**
     * Listado público de especialidades.
     */
    public function specialties()
    {
        $specialties = Specialty::where('is_active', true)->withCount('doctors')->get();
        return response()->json(['success' => true, 'data' => $specialties]);
    }

    /**
     * Listado de médicos con filtro opcional por especialidad.
     */
    public function index(Request $request)
    {
        $query = Doctor::with(['user:id,name,email,phone', 'specialty'])
            ->where('is_available', true);

        if ($request->has('specialty_id') && $request->specialty_id) {
            $query->where('specialty_id', $request->specialty_id);
        }

        if ($request->has('search') && $request->search) {
            $term = $request->search;
            $query->whereHas('user', function ($q) use ($term) {
                $q->where('name', 'like', "%{$term}%");
            });
        }

        $doctors = $query->get();

        return response()->json([
            'success' => true,
            'data'    => $doctors
        ]);
    }

    /**
     * Detalle del médico y sus horarios regulares.
     */
    public function show($id)
    {
        $doctor = Doctor::with(['user', 'specialty', 'schedules' => function ($q) {
            $q->where('is_active', true)->orderBy('day_of_week');
        }])->findOrFail($id);

        return response()->json(['success' => true, 'data' => $doctor]);
    }

    /**
     * Disponibilidad en tiempo real para una fecha específica.
     * Genera slots de 30 minutos y excluye las citas ya reservadas.
     */
    public function getAvailableSlots(Request $request, $doctorId)
    {
        $request->validate([
            'date' => 'required|date|after_or_equal:today',
        ]);

        $date = Carbon::parse($request->date);
        $dayOfWeek = $date->dayOfWeekIso; // 1 (Lunes) a 7 (Domingo)

        $schedule = DoctorSchedule::where('doctor_id', $doctorId)
            ->where('day_of_week', $dayOfWeek)
            ->where('is_active', true)
            ->first();

        if (!$schedule) {
            return response()->json([
                'success' => true,
                'available' => false,
                'message' => 'El médico no atiende en el día seleccionado.',
                'slots' => []
            ]);
        }

        // Citas ya reservadas para este médico en esta fecha
        $bookedTimes = Appointment::where('doctor_id', $doctorId)
            ->whereDate('appointment_date', $date->toDateString())
            ->whereIn('status', ['pendiente', 'confirmada'])
            ->pluck('appointment_time')
            ->map(function ($time) {
                return substr($time, 0, 5); // formato 'HH:mm'
            })
            ->toArray();

        // Generar intervalos de tiempo según slot_duration_minutes
        $slots = [];
        $slotMinutes = $schedule->slot_duration_minutes ?: 30;
        $start = Carbon::parse($date->toDateString() . ' ' . $schedule->start_time);
        $end = Carbon::parse($date->toDateString() . ' ' . $schedule->end_time);

        $now = Carbon::now();

        while ($start->copy()->addMinutes($slotMinutes)->lte($end)) {
            $timeSlotStr = $start->format('H:i');
            $isPast = $date->isToday() && $start->lt($now);
            $isBooked = in_array($timeSlotStr, $bookedTimes);

            $slots[] = [
                'time'      => $timeSlotStr,
                'display'   => $start->format('h:i A'),
                'available' => !$isBooked && !$isPast,
                'status'    => $isBooked ? 'Ocupado' : ($isPast ? 'Pasado' : 'Disponible')
            ];

            $start->addMinutes($slotMinutes);
        }

        return response()->json([
            'success'   => true,
            'available' => true,
            'date'      => $date->toDateString(),
            'slots'     => $slots
        ]);
    }

    /**
     * Médico: Gestionar sus horarios de atención semanal.
     */
    public function updateSchedules(Request $request)
    {
        $user = $request->user();
        $doctor = $user->doctorProfile;

        if (!$doctor) {
            return response()->json(['success' => false, 'message' => 'Perfil médico no encontrado.'], 403);
        }

        $request->validate([
            'schedules' => 'required|array',
            'schedules.*.day_of_week' => 'required|integer|between:1,6',
            'schedules.*.start_time' => 'required|date_format:H:i',
            'schedules.*.end_time' => 'required|date_format:H:i|after:schedules.*.start_time',
            'schedules.*.is_active' => 'required|boolean',
        ]);

        foreach ($request->schedules as $item) {
            DoctorSchedule::updateOrCreate(
                [
                    'doctor_id'   => $doctor->id,
                    'day_of_week' => $item['day_of_week']
                ],
                [
                    'start_time'  => $item['start_time'],
                    'end_time'    => $item['end_time'],
                    'slot_duration_minutes' => 30,
                    'is_active'   => $item['is_active']
                ]
            );
        }

        return response()->json([
            'success' => true,
            'message' => 'Horarios actualizados exitosamente.',
            'schedules' => $doctor->schedules()->get()
        ]);
    }
}
