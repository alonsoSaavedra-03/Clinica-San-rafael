<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Franja horaria de atención semanal del médico.
 * day_of_week: 1 (Lunes) a 6 (Sábado).
 */
class DoctorSchedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'doctor_id',
        'day_of_week',          // 1=Lunes, 2=Martes... 6=Sábado
        'start_time',           // '08:00:00'
        'end_time',             // '13:00:00'
        'slot_duration_minutes',// Duración por consulta (ej. 30 min)
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'slot_duration_minutes' => 'integer',
        'day_of_week' => 'integer',
    ];

    public function doctor()
    {
        return $this->belongsTo(Doctor::class, 'doctor_id');
    }
}
