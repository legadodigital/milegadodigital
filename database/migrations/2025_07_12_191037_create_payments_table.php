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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('plan_id')->constrained()->onDelete('cascade');
            $table->decimal('amount', 10, 2);
            $table->string('buy_order')->unique();
            $table->string('session_id');
            $table->string('token_ws')->nullable();
            $table->string('status'); // e.g., 'approved', 'rejected', 'pending'
            $table->json('transbank_response')->nullable();
            $table->string('payment_method'); // e.g., 'webpay', 'oneclick'
            $table->string('card_number')->nullable(); // Last 4 digits
            $table->timestamp('transaction_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
