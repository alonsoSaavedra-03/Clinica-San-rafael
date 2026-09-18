<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('doctor_id')->constrained('doctors')->onDelete('cascade');
            $table->foreignId('specialty_id')->constrained('specialties')->onDelete('restrict');
            $table->date('appointment_date');
            $table->time('appointment_time');
            $table->text('reason')->comment('Motivo de consulta o síntomas');
            $table->enum('status', ['pendiente', 'confirmada', 'atendida', 'cancelada'])->default('confirmada');
            $table->text('clinical_notes')->nullable()->comment('Notas o prescripción del médico');
            $table->text('cancellation_reason')->nullable();
            $table->string('cancelled_by', 30)->nullable();
            $table->string('confirmation_code', 15)->unique();
            $table->timestamps();

            // Índice para optimizar búsqueda de agenda y evitar doble reserva
            $table->index(['doctor_id', 'appointment_date', 'appointment_time']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
