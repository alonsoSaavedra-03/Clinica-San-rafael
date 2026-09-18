<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\User;
use App\Models\Specialty;
use Illuminate\Http\Request;
use Carbon\Carbon;

/**
 * Controlador para el Panel Administrativo de Salud Rápida S.A.
 * Métricas institucionales, reportería y gestión de personal médico.
 */
class AdminController extends Controller
{
    /**
     * Dashboard general de métricas para la administración.
     */
    public function dashboard()
    {
        $today = Carbon::today()->toDateString();

        $stats = [
            'total_appointments'     => Appointment::count(),
            'today_appointments'     => Appointment::whereDate('appointment_date', $today)->count(),
            'confirmed_appointments' => Appointment::where('status', 'confirmada')->count(),
            'attended_appointments'  => Appointment::where('status', 'atendida')->count(),
            'cancelled_appointments' => Appointment::where('status', 'cancelada')->count(),
            'total_patients'         => User::where('role', 'paciente')->count(),
            'total_doctors'          => Doctor::count(),
            'total_specialties'      => Specialty::count(),
        ];

        $recentAppointments = Appointment::with(['patient:id,name,dni', 'doctor.user:id,name', 'specialty:id,name'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return response()->json([
            'success' => true,
            'data'    => [
                'stats'               => $stats,
                'recent_appointments' => $recentAppointments,
            ]
        ]);
    }

    /**
     * Listado general de usuarios con filtros.
     */
    public function users(Request $request)
    {
        $query = User::query();

        if ($request->has('role') && $request->role) {
            $query->where('role', $request->role);
        }

        return response()->json([
            'success' => true,
            'data'    => $query->paginate(20)
        ]);
    }
}
