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
        Schema::create('mensajes_postumos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('titulo');
            $table->text('contenido');
            $table->enum('tipo_mensaje', ['texto', 'video', 'audio'])->default('texto');
            $table->string('destinatario_email');
            $table->string('destinatario_nombre')->nullable();
            $table->timestamp('fecha_entrega');
            $table->enum('estado', ['pendiente', 'enviado', 'leido', 'fallido'])->default('pendiente');
            $table->timestamp('delivered_at')->nullable();
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mensajes_postumos');
    }
};
