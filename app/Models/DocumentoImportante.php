<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DocumentoImportante extends Model
{
    protected $table = 'documentos_importantes';

    protected $fillable = [
        'user_id',
        'titulo',
        'descripcion',
        'categoria',
        'ruta_archivo',
        'tipo_archivo',
        'tamano_archivo',
        'nivel_acceso',
        'encriptado',
        'clave_encriptacion',
    ];

    protected $casts = [
        'encriptado' => 'boolean',
    ];

    /**
     * Get the user that owns the document.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the permissions for the document.
     */
    public function permisos(): HasMany
    {
        return $this->hasMany(PermisoDocumento::class, 'documento_id');
    }
}
