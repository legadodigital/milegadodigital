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
        Schema::create('permisos_documentos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('documento_id')->constrained('documentos_importantes')->onDelete('cascade');
            $table->foreignId('contacto_id')->constrained('contactos_confianza')->onDelete('cascade');
            $table->timestamp('fecha_expiracion')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('permisos_documentos');
    }
};
