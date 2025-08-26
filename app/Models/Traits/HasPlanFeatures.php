<?php

namespace App\Models\Traits;

use App\Models\PlanFeature;

trait HasPlanFeatures
{
    public function getPlanFeature(string $feature_code)
    {
        return $this->plan->features()->where('feature_code', $feature_code)->first();
    }

    public function hasPlanFeature(string $feature_code): bool
    {
        return $this->getPlanFeature($feature_code) !== null;
    }

    public function getPlanFeatureValue(string $feature_code)
    {
        $feature = $this->getPlanFeature($feature_code);
        return $feature ? $feature->value : null;
    }

    public function canRecordVideo(): bool
    {
        return $this->getPlanFeatureValue('video_recording') === 'true';
    }

    public function getVideoDurationLimit(): int
    {
        return (int) $this->getPlanFeatureValue('video_duration');
    }
}
