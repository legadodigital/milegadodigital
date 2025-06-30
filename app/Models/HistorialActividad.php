<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HistorialActividad extends Model
{
    protected $table = 'historial_actividades';

    protected $fillable = [
        'user_id',
        'accion',
        'info_dispositivo',
        'direccion_ip',
        'ubicacion',
        'user_agent',
        'estado',
    ];

    /**
     * Get the user that owns the activity history.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
