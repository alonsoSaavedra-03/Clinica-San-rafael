<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * Seeder principal de la base de datos de Salud Rápida S.A.
 * Genera usuarios base (Admin, Paciente demo), especialidades, médicos y citas.
 */
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Usuario Administrador de la clínica
        User::updateOrCreate(
            ['email' => 'admin@saludrapida.pe'],
            [
                'name' => 'Lic. María Elena Torres',
                'password' => Hash::make('admin123'),
                'role' => 'administrador',
                'dni' => '10293847',
                'phone' => '+51 912 345 678',
            ]
        );

        // 2. Paciente demo para pruebas
        User::updateOrCreate(
            ['email' => 'paciente@saludrapida.pe'],
            [
                'name' => 'Juan Pérez Alvarado',
                'password' => Hash::make('paciente123'),
                'role' => 'paciente',
                'dni' => '72839102',
                'phone' => '+51 984 567 890',
                'birth_date' => '1992-05-14',
                'address' => 'Av. Javier Prado Este 2450, San Borja, Lima',
            ]
        );

        // 3. Especialidades
        $this->call(SpecialtySeeder::class);

        // 4. Médicos y horarios
        $this->call(DoctorSeeder::class);

        // 5. Citas médicas demo
        $this->call(AppointmentSeeder::class);
    }
}
