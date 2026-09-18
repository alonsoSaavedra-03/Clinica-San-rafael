<?php

namespace Database\Seeders;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\User;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

/**
 * Seeder con citas médicas de prueba para demostración inmediata.
 */
class AppointmentSeeder extends Seeder
{
    public function run(): void
    {
        $patient = User::where('role', 'paciente')->first();
        $doctor = Doctor::with('specialty')->first();

        if ($patient && $doctor) {
            $today = Carbon::today();

            Appointment::updateOrCreate(
                ['confirmation_code' => 'SR-DEMO1'],
                [
                    'patient_id'        => $patient->id,
                    'doctor_id'         => $doctor->id,
                    'specialty_id'      => $doctor->specialty_id,
                    'appointment_date'  => $today->copy()->addDays(1)->toDateString(),
                    'appointment_time'  => '09:00:00',
                    'reason'            => 'Control preventivo anual y chequeo de presión arterial.',
                    'status'            => 'confirmada',
                ]
            );

            Appointment::updateOrCreate(
                ['confirmation_code' => 'SR-DEMO2'],
                [
                    'patient_id'        => $patient->id,
                    'doctor_id'         => $doctor->id,
                    'specialty_id'      => $doctor->specialty_id,
                    'appointment_date'  => $today->copy()->subDays(5)->toDateString(),
                    'appointment_time'  => '10:30:00',
                    'reason'            => 'Molestias en el pecho tras esfuerzo físico leve.',
                    'status'            => 'atendida',
                    'clinical_notes'    => 'Paciente presenta cifras tensionales normales. Se solicitó electrocardiograma de control y perfil lipídico.',
                ]
            );
        }
    }
}
