<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ConfiguracionSeguridad extends Model
{
    protected $table = 'configuracion_seguridad';

    protected $fillable = [
        'user_id',
        'session_timeout',
        'biometria_habilitada',
        'nivel_encriptacion',
        'contrasena_ultimo_cambio',
    ];

    protected $casts = [
        'biometria_habilitada' => 'boolean',
        'contrasena_ultimo_cambio' => 'datetime',
    ];

    /**
     * Get the user that owns the security settings.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
