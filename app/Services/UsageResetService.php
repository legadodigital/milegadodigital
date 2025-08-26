<?php

namespace App\Services;

use App\Models\User;
use App\Models\UserUsage;
use Illuminate\Support\Facades\Log;

class UsageResetService
{
    /**
     * Resets the usage counters for a given user.
     *
     * @param User $user
     * @return void
     */
    public function resetUsageForUser(User $user): void
    {
        try {
            // This will set the usage_count to 0 for all feature records of the user.
            UserUsage::where('user_id', $user->id)->update(['usage_count' => 0]);

            Log::info('Usage counters reset successfully for user.', ['user_id' => $user->id]);

        } catch (\Exception $e) {
            Log::error('Failed to reset usage counters for user.', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
