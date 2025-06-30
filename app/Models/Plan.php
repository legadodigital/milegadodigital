<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Plan extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'price',
        'description',
    ];

    /**
     * Get the features for the plan.
     */
    public function features(): HasMany
    {
        return $this->hasMany(PlanFeature::class);
    }
}
