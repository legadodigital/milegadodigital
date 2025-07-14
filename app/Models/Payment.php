<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    protected $fillable = [
        'user_id',
        'plan_id',
        'amount',
        'buy_order',
        'session_id',
        'token_ws',
        'status',
        'transbank_response',
        'payment_method',
        'card_number',
        'transaction_date',
        'billing_cycle',
    ];

    protected $casts = [
        'transbank_response' => 'array',
        'transaction_date' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }
}
