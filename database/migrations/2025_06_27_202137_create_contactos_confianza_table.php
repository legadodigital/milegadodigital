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
        Schema::create('contactos_confianza', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('nombre');
            $table->string('email');
            $table->string('telefono', 50)->nullable();
            $table->string('relacion', 100)->nullable();
            $table->enum('nivel_acceso', ['total', 'limitado', 'emergencia']);
            $table->boolean('verificado')->default(false);
            $table->string('token_verificacion')->nullable();
            $table->text('notas')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contactos_confianza');
    }
};
