<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Modelo de Cita Médica.
 * Estados: 'pendiente', 'confirmada', 'atendida', 'cancelada'
 */
class Appointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id',
        'doctor_id',
        'specialty_id',
        'appointment_date',
        'appointment_time',
        'reason',
        'status',
        'clinical_notes',
        'cancellation_reason',
        'cancelled_by',
        'confirmation_code',
    ];

    protected $casts = [
        'appointment_date' => 'date',
    ];

    public function patient()
    {
        return $this->belongsTo(User::class, 'patient_id');
    }

    public function doctor()
    {
        return $this->belongsTo(Doctor::class, 'doctor_id');
    }

    public function specialty()
    {
        return $this->belongsTo(Specialty::class, 'specialty_id');
    }

    // Generar código de cita único para identificación de la clínica (ej: SR-8492)
    public static function generateCode(): string
    {
        return 'SR-' . strtoupper(substr(uniqid(), -5));
    }
}
