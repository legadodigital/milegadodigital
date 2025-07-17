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
        Schema::table('wish_list_items', function (Blueprint $table) {
            $table->date('completion_date')->nullable()->after('completed');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('wish_list_items', function (Blueprint $table) {
            $table->dropColumn(['completion_date']);
        });
    }
};
