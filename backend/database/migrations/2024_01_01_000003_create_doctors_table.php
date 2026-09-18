<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('doctors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('specialty_id')->constrained('specialties')->onDelete('restrict');
            $table->string('cmp', 10)->unique()->comment('Colegio Médico del Perú');
            $table->string('rne', 10)->nullable()->comment('Registro Nacional de Especialista');
            $table->text('bio')->nullable();
            $table->decimal('consultation_fee', 8, 2)->default(80.00);
            $table->string('office_number', 20)->default('Cons-101');
            $table->string('avatar_url', 255)->nullable();
            $table->boolean('is_available')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('doctors');
    }
};
