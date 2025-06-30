<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('documentos_importantes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('titulo');
            $table->text('descripcion')->nullable();
            $table->string('categoria', 50);
            $table->string('ruta_archivo', 500);
            $table->string('tipo_archivo', 50);
            $table->bigInteger('tamano_archivo');
            $table->enum('nivel_acceso', ['privado', 'confianza', 'publico'])->default('privado');
            $table->boolean('encriptado')->default(true);
            $table->string('clave_encriptacion')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documentos_importantes');
    }
};
