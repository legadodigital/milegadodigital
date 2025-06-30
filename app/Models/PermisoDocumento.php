<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PermisoDocumento extends Model
{
    protected $table = 'permisos_documentos';

    protected $fillable = [
        'documento_id',
        'contacto_id',
        'fecha_expiracion',
    ];

    protected $casts = [
        'fecha_expiracion' => 'datetime',
    ];

    /**
     * Get the document that owns the permission.
     */
    public function documento(): BelongsTo
    {
        return $this->belongsTo(DocumentoImportante::class, 'documento_id');
    }

    /**
     * Get the trusted contact that owns the permission.
     */
    public function contactoConfianza(): BelongsTo
    {
        return $this->belongsTo(ContactoConfianza::class, 'contacto_id');
    }
}
