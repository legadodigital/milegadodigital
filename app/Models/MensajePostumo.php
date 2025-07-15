<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MensajePostumo extends Model
{
    use HasFactory;

    protected $table = 'mensajes_postumos';

    protected $fillable = [
        'user_id',
        'titulo',
        'contenido',
        'ruta_archivo',
        'tipo_archivo_media',
        'tipo_mensaje',
        'destinatario_email',
        'destinatario_nombre',
        'fecha_entrega',
        'estado',
        'delivered_at',
        'read_at',
    ];

    protected $casts = [
        'fecha_entrega' => 'datetime',
        'delivered_at' => 'datetime',
        'read_at' => 'datetime',
    ];

    /**
     * Get the user that owns the message.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
