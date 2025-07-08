<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OneclickInscription extends Model
{
    protected $fillable = [
        'user_id',
        'tbk_user',
        'card_type',
        'card_number',
        'is_active',
    ];

    /**
     * Get the user that owns the OneclickInscription.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
