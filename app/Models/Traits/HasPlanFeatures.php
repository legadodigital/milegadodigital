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

    public function canCreateMessage(): bool
    {
        $maxMessages = $this->getPlanFeatureValue('max_messages');
        if ($maxMessages === '-1') {
            return true; // Unlimited
        }
        return $this->mensajesPostumos()->count() < $maxMessages;
    }

    public function canUploadDocument(): bool
    {
        $maxDocuments = $this->getPlanFeatureValue('max_documents');
        if ($maxDocuments === '-1') {
            return true; // Unlimited
        }
        return $this->documentosImportantes()->count() < $maxDocuments;
    }

    public function canAddTrustedContact(): bool
    {
        $maxContacts = $this->getPlanFeatureValue('max_trusted_contacts');
        if ($maxContacts === '-1') {
            return true; // Unlimited
        }
        return $this->contactosConfianza()->count() < $maxContacts;
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
