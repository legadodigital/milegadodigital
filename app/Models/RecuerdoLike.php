<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RecuerdoLike extends Model
{
    protected $table = 'recuerdos_likes';

    protected $fillable = [
        'recuerdo_id',
        'user_id',
    ];

    /**
     * Get the memory that owns the like.
     */
    public function recuerdo(): BelongsTo
    {
        return $this->belongsTo(Recuerdo::class, 'recuerdo_id');
    }

    /**
     * Get the user that owns the like.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
