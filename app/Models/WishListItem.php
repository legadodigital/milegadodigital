<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WishListItem extends Model
{
    protected $fillable = [
        'user_id',
        'description',
        'completed',
        'completion_date',
    ];

    protected $casts = [
        'completed' => 'boolean',
        'completion_date' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
