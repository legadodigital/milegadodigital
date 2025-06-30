<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ContactoConfianza extends Model
{
    protected $table = 'contactos_confianza';

    protected $fillable = [
        'user_id',
        'nombre',
        'email',
        'telefono',
        'relacion',
        'nivel_acceso',
        'verificado',
        'token_verificacion',
        'notas',
    ];

    protected $casts = [
        'verificado' => 'boolean',
    ];

    /**
     * Get the user that owns the trusted contact.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the document permissions for the trusted contact.
     */
    public function permisosDocumentos(): HasMany
    {
        return $this->hasMany(PermisoDocumento::class, 'contacto_id');
    }

    /**
     * Get the notifications for the trusted contact.
     */
    public function notificaciones(): HasMany
    {
        return $this->hasMany(Notificacion::class, 'contacto_id');
    }
}
