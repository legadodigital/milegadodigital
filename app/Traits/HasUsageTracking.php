<?php

namespace App\Traits;

use App\Models\User;
use App\Models\UserUsage;
use Illuminate\Support\Facades\Log;

trait HasUsageTracking
{
    /**
     * Checks if a user can perform an action based on their plan limits and current usage.
     *
     * @param User $user The user performing the action.
     * @param string $featureCode The code of the feature (e.g., 'max_documents', 'max_messages').
     * @return bool True if the user can perform the action, false otherwise.
     */
    protected function canPerformAction(User $user, string $featureCode): bool
    {
        // Admins have unlimited access
        if ($user->is_admin) {
            return true;
        }

        // Load the user's plan features
        $planFeature = $user->plan->features->where('feature_code', $featureCode)->first();

        // If the feature is not defined for the plan, assume unlimited or disallow based on business logic
        if (!$planFeature) {
            Log::warning('Feature not defined for plan.', ['user_id' => $user->id, 'plan_id' => $user->plan_id, 'feature_code' => $featureCode]);
            return false; // Or true, depending on default policy for undefined features
        }

        $limit = (int) $planFeature->value;

        // If limit is 0, it means the feature is not allowed for this plan
        if ($limit === 0) {
            return false;
        }

        // Get current usage for the feature
        $userUsage = UserUsage::firstOrCreate(
            ['user_id' => $user->id, 'feature_code' => $featureCode],
            ['usage_count' => 0]
        );

        return $userUsage->usage_count < $limit;
    }

    /**
     * Increments the usage counter for a user for a specific feature.
     *
     * @param User $user The user performing the action.
     * @param string $featureCode The code of the feature.
     * @return void
     */
    protected function incrementUsage(User $user, string $featureCode): void
    {
        UserUsage::firstOrCreate(
            ['user_id' => $user->id, 'feature_code' => $featureCode],
            ['usage_count' => 0]
        )->increment('usage_count');
    }
}
