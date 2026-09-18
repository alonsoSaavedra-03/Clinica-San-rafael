<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Especialidades médicas de la clínica Salud Rápida S.A.
 */
class Specialty extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'icon',
        'is_active',
    ];

    public function doctors()
    {
        return $this->hasMany(Doctor::class, 'specialty_id');
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'specialty_id');
    }
}
