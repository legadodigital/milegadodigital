<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Models\Traits\HasPlanFeatures;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Payment; // Add this line

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasPlanFeatures;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'two_factor_enabled',
        'two_factor_secret',
        'is_verified',
        'plan_id',
        'fecha_nacimiento',
        'pais',
        'direccion',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_enabled' => 'boolean',
            'is_verified' => 'boolean',
            'is_admin' => 'boolean',
        ];
    }

    /**
     * Get the messages for the user.
     */
    public function mensajesPostumos(): HasMany
    {
        return $this->hasMany(MensajePostumo::class);
    }

    /**
     * Get the important documents for the user.
     */
    public function documentosImportantes(): HasMany
    {
        return $this->hasMany(DocumentoImportante::class);
    }

    /**
     * Get the trusted contacts for the user.
     */
    public function contactosConfianza(): HasMany
    {
        return $this->hasMany(ContactoConfianza::class);
    }

    /**
     * Get the memories for the user.
     */
    public function recuerdos(): HasMany
    {
        return $this->hasMany(Recuerdo::class);
    }

    /**
     * Get the security settings for the user.
     */
    public function configuracionSeguridad(): HasOne
    {
        return $this->hasOne(ConfiguracionSeguridad::class);
    }

    /**
     * Get the security activities for the user.
     */
    public function historialActividades(): HasMany
    {
        return $this->hasMany(HistorialActividad::class);
    }

    /**
     * Get the notifications for the user.
     */
    public function notificaciones(): HasMany
    {
        return $this->hasMany(Notificacion::class);
    }

    /**
     * Get the plan that the user belongs to.
     */
    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }

    /**
     * Get the Oneclick inscriptions for the user.
     */
    public function oneclickInscriptions(): HasMany
    {
        return $this->hasMany(OneclickInscription::class);
    }

    /**
     * Get the payments for the user.
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }
}
