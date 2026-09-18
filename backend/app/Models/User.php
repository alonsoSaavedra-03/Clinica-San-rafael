<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/**
 * Modelo de Usuario con soporte para Sanctum y roles de negocio:
 * 'paciente', 'medico', 'administrador'.
 */
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',          // 'paciente' | 'medico' | 'administrador'
        'dni',           // Documento Nacional de Identidad
        'phone',         // Celular de contacto
        'address',       // Dirección del paciente/usuario
        'birth_date',    // Fecha de nacimiento
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'birth_date' => 'date',
    ];

    // Relación: Si el usuario es médico, tiene perfil profesional extendido
    public function doctorProfile()
    {
        return $this->hasOne(Doctor::class, 'user_id');
    }

    // Relación: Citas registradas como paciente
    public function patientAppointments()
    {
        return $this->hasMany(Appointment::class, 'patient_id');
    }

    // Helper para verificar rol rápidamente
    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }
}
