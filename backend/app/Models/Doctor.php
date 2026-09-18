<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Perfil profesional del médico: colegiatura CMP, registro de especialista RNE,
 * consultorio y horarios de atención.
 */
class Doctor extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'specialty_id',
        'cmp',                  // Colegio Médico del Perú
        'rne',                  // Registro Nacional de Especialista
        'bio',
        'consultation_fee',     // Tarifa de consulta en PEN (Soles)
        'office_number',        // N° consultorio
        'avatar_url',
        'is_available',
    ];

    protected $casts = [
        'consultation_fee' => 'decimal:2',
        'is_available' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function specialty()
    {
        return $this->belongsTo(Specialty::class, 'specialty_id');
    }

    public function schedules()
    {
        return $this->hasMany(DoctorSchedule::class, 'doctor_id');
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'doctor_id');
    }
}
