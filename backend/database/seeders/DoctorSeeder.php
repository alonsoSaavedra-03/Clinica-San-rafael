<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Doctor;
use App\Models\Specialty;
use App\Models\DoctorSchedule;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * Seeder con médicos realistas peruanos (CMP, RNE y horarios).
 */
class DoctorSeeder extends Seeder
{
    public function run(): void
    {
        $doctorsData = [
            [
                'name' => 'Dr. Carlos Mendoza Paredes',
                'email' => 'carlos.mendoza@saludrapida.pe',
                'dni' => '40892314',
                'phone' => '+51 987 654 321',
                'specialty' => 'Cardiología',
                'cmp' => '48291',
                'rne' => '24109',
                'bio' => 'Especialista en cardiología clínica y prevención de riesgo cardiovascular con más de 14 años de trayectoria hospitalaria.',
                'fee' => 120.00,
                'office' => 'Cons. 302 - Torre A',
                'schedules' => [
                    ['day' => 1, 'start' => '08:00', 'end' => '13:00'],
                    ['day' => 3, 'start' => '08:00', 'end' => '13:00'],
                    ['day' => 5, 'start' => '14:00', 'end' => '19:00'],
                ]
            ],
            [
                'name' => 'Dra. Patricia Silva Rojas',
                'email' => 'patricia.silva@saludrapida.pe',
                'dni' => '42189032',
                'phone' => '+51 976 543 210',
                'specialty' => 'Pediatría',
                'cmp' => '52104',
                'rne' => '27891',
                'bio' => 'Pediatra certificada enfocada en desarrollo del infante, nutrición infantil y medicina preventiva.',
                'fee' => 100.00,
                'office' => 'Cons. 204 - Torre B',
                'schedules' => [
                    ['day' => 1, 'start' => '09:00', 'end' => '14:00'],
                    ['day' => 2, 'start' => '09:00', 'end' => '14:00'],
                    ['day' => 4, 'start' => '09:00', 'end' => '14:00'],
                    ['day' => 6, 'start' => '09:00', 'end' => '13:00'],
                ]
            ],
            [
                'name' => 'Dr. Fernando Benavides Castro',
                'email' => 'fernando.benavides@saludrapida.pe',
                'dni' => '38902145',
                'phone' => '+51 965 432 109',
                'specialty' => 'Traumatología y Ortopedia',
                'cmp' => '39820',
                'rne' => '18490',
                'bio' => 'Cirujano ortopedista y traumatólogo, experto en lesiones deportivas y cirugía artroscópica.',
                'fee' => 130.00,
                'office' => 'Cons. 108 - Torre A',
                'schedules' => [
                    ['day' => 2, 'start' => '14:00', 'end' => '19:00'],
                    ['day' => 4, 'start' => '14:00', 'end' => '19:00'],
                    ['day' => 6, 'start' => '08:00', 'end' => '12:00'],
                ]
            ],
            [
                'name' => 'Dra. Gabriela Vega Ugarte',
                'email' => 'gabriela.vega@saludrapida.pe',
                'dni' => '45091283',
                'phone' => '+51 954 321 098',
                'specialty' => 'Medicina General',
                'cmp' => '61294',
                'rne' => null,
                'bio' => 'Médico cirujano egresada de UNMSM. Atención primaria de salud, chequeos preventivos y control de patologías crónicas.',
                'fee' => 70.00,
                'office' => 'Cons. 101 - Entrada',
                'schedules' => [
                    ['day' => 1, 'start' => '08:00', 'end' => '14:00'],
                    ['day' => 2, 'start' => '08:00', 'end' => '14:00'],
                    ['day' => 3, 'start' => '08:00', 'end' => '14:00'],
                    ['day' => 4, 'start' => '08:00', 'end' => '14:00'],
                    ['day' => 5, 'start' => '08:00', 'end' => '14:00'],
                ]
            ],
        ];

        foreach ($doctorsData as $d) {
            $user = User::updateOrCreate(
                ['email' => $d['email']],
                [
                    'name' => $d['name'],
                    'password' => Hash::make('password123'),
                    'role' => 'medico',
                    'dni' => $d['dni'],
                    'phone' => $d['phone'],
                ]
            );

            $spec = Specialty::where('name', $d['specialty'])->first();

            $doctor = Doctor::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'specialty_id' => $spec ? $spec->id : 1,
                    'cmp' => $d['cmp'],
                    'rne' => $d['rne'],
                    'bio' => $d['bio'],
                    'consultation_fee' => $d['fee'],
                    'office_number' => $d['office'],
                    'is_available' => true,
                ]
            );

            foreach ($d['schedules'] as $sch) {
                DoctorSchedule::updateOrCreate(
                    [
                        'doctor_id' => $doctor->id,
                        'day_of_week' => $sch['day']
                    ],
                    [
                        'start_time' => $sch['start'] . ':00',
                        'end_time' => $sch['end'] . ':00',
                        'slot_duration_minutes' => 30,
                        'is_active' => true,
                    ]
                );
            }
        }
    }
}
