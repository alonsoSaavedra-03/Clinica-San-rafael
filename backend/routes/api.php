<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\AdminController;

/*
|--------------------------------------------------------------------------
| Rutas de la API RESTful - Salud Rápida S.A.
|--------------------------------------------------------------------------
| Autenticación mediante Laravel Sanctum con roles ('paciente', 'medico', 'administrador')
*/

// --- Rutas Públicas ---
Route::prefix('v1')->group(function () {
    // Autenticación
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);

    // Catálogo médico público para consulta y selección
    Route::get('/specialties', [DoctorController::class, 'specialties']);
    Route::get('/doctors', [DoctorController::class, 'index']);
    Route::get('/doctors/{id}', [DoctorController::class, 'show']);
    Route::get('/doctors/{id}/available-slots', [DoctorController::class, 'getAvailableSlots']);

    // --- Rutas Protegidas (Requieren Token Sanctum) ---
    Route::middleware('auth:sanctum')->group(function () {
        // Sesión del usuario actual
        Route::get('/auth/profile', [AuthController::class, 'profile']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        // Gestión de Citas Médicas (CRUD según rol)
        Route::get('/appointments', [AppointmentController::class, 'index']);
        Route::post('/appointments', [AppointmentController::class, 'store']);
        Route::get('/appointments/{id}', [AppointmentController::class, 'show']);
        Route::put('/appointments/{id}', [AppointmentController::class, 'update']);
        Route::patch('/appointments/{id}/cancel', [AppointmentController::class, 'cancel']);

        // Módulo Médico: Gestión de horarios y atención clínica
        Route::middleware('role:medico,administrador')->group(function () {
            Route::put('/doctor/schedules', [DoctorController::class, 'updateSchedules']);
            Route::patch('/appointments/{id}/attend', [AppointmentController::class, 'attend']);
        });

        // Módulo Administrador: Reportería y métricas
        Route::middleware('role:administrador')->group(function () {
            Route::get('/admin/dashboard', [AdminController::class, 'dashboard']);
            Route::get('/admin/users', [AdminController::class, 'users']);
        });
    });
});
