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
        Schema::create('recuerdos_media', function (Blueprint $table) {
            $table->id();
            $table->foreignId('recuerdo_id')->constrained('recuerdos')->onDelete('cascade');
            $table->enum('tipo_media', ['imagen', 'video', 'audio']);
            $table->string('ruta_archivo', 500);
            $table->string('descripcion')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recuerdos_media');
    }
};
