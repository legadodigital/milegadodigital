<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Recuerdo extends Model
{
    protected $table = 'recuerdos';

    protected $fillable = [
        'user_id',
        'titulo',
        'historia',
        'ubicacion',
        'fecha_recuerdo',
        'visibilidad',
    ];

    protected $casts = [
        'fecha_recuerdo' => 'date',
    ];

    /**
     * Get the user that owns the memory.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the media for the memory.
     */
    public function media(): HasMany
    {
        return $this->hasMany(RecuerdoMedia::class, 'recuerdo_id');
    }

    /**
     * Get the likes for the memory.
     */
    public function likes(): HasMany
    {
        return $this->hasMany(RecuerdoLike::class, 'recuerdo_id');
    }
}
