<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RecuerdoMedia extends Model
{
    protected $table = 'recuerdos_media';

    protected $fillable = [
        'recuerdo_id',
        'tipo_media',
        'ruta_archivo',
        'descripcion',
    ];

    /**
     * Get the memory that owns the media.
     */
    public function recuerdo(): BelongsTo
    {
        return $this->belongsTo(Recuerdo::class, 'recuerdo_id');
    }
}
