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
        Schema::table('mensajes_postumos', function (Blueprint $table) {
            $table->string('ruta_archivo')->nullable()->after('contenido');
            $table->enum('tipo_archivo_media', ['imagen', 'video', 'audio'])->nullable()->after('ruta_archivo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('mensajes_postumos', function (Blueprint $table) {
            $table->dropColumn(['ruta_archivo', 'tipo_archivo_media']);
        });
    }
};
