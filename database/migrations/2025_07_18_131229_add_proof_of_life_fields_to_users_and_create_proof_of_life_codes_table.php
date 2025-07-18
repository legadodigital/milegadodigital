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
        Schema::table('users', function (Blueprint $table) {
            $table->integer('proof_of_life_frequency_days')->nullable()->default(90)->after('is_admin');
            $table->timestamp('last_proof_of_life_at')->nullable()->after('proof_of_life_frequency_days');
            $table->timestamp('last_login_at')->nullable()->after('last_proof_of_life_at');
        });

        Schema::create('proof_of_life_codes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('code')->unique();
            $table->timestamp('expires_at');
            $table->timestamp('used_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['proof_of_life_frequency_days', 'last_proof_of_life_at', 'last_login_at']);
        });

        Schema::dropIfExists('proof_of_life_codes');
    }
};