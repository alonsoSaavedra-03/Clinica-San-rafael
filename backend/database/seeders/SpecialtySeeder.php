<?php

namespace Database\Seeders;

use App\Models\Specialty;
use Illuminate\Database\Seeder;

/**
 * Seeder con especialidades médicas reales de la clínica Salud Rápida S.A.
 */
class SpecialtySeeder extends Seeder
{
    public function run(): void
    {
        $specialties = [
            [
                'name' => 'Medicina General',
                'description' => 'Evaluación integral, diagnóstico preventivo y tratamiento de patologías comunes.',
                'icon' => 'stethoscope',
            ],
            [
                'name' => 'Cardiología',
                'description' => 'Diagnóstico y tratamiento de afecciones del corazón y del sistema cardiovascular.',
                'icon' => 'heart',
            ],
            [
                'name' => 'Pediatría',
                'description' => 'Atención médica integral para recién nacidos, niños y adolescentes.',
                'icon' => 'user-check',
            ],
            [
                'name' => 'Traumatología y Ortopedia',
                'description' => 'Tratamiento de lesiones óseas, articulares, musculares y rehabilitación.',
                'icon' => 'activity',
            ],
            [
                'name' => 'Ginecología y Obstetricia',
                'description' => 'Cuidado de la salud integral de la mujer y control prenatal.',
                'icon' => 'shield',
            ],
            [
                'name' => 'Dermatología',
                'description' => 'Diagnóstico y tratamiento clínico de enfermedades de la piel, pelo y uñas.',
                'icon' => 'sun',
            ],
            [
                'name' => 'Oftalmología',
                'description' => 'Salud visual integral, despistaje de agudeza visual y patologías oculares.',
                'icon' => 'eye',
            ],
            [
                'name' => 'Neurología',
                'description' => 'Estudio y tratamiento del sistema nervioso central, periférico y autónomo.',
                'icon' => 'cpu',
            ],
        ];

        foreach ($specialties as $item) {
            Specialty::updateOrCreate(['name' => $item['name']], $item);
        }
    }
}
