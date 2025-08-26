<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Services\UsageResetService;
use Carbon\Carbon;

class ResetMonthlyUsage extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'usage:reset-monthly';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Resets monthly usage counters for users whose billing cycle has ended and usage has not been reset.';

    protected $usageResetService;

    public function __construct(UsageResetService $usageResetService)
    {
        parent::__construct();
        $this->usageResetService = $usageResetService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting monthly usage reset check...');

        // Find users who have a plan and whose last payment was more than a month ago
        // and whose usage might not have been reset.
        // This is a simplified example. A more robust solution might involve
        // tracking the last reset date on the User or Payment model.
        $usersToReset = User::whereNotNull('plan_id')
            ->whereHas('payments', function ($query) {
                $query->where('status', 'approved')
                      ->where('transaction_date', '<=', Carbon::now()->subMonth());
            })
            ->get();

        if ($usersToReset->isEmpty()) {
            $this->info('No users found requiring a monthly usage reset.');
            return Command::SUCCESS;
        }

        $this->info(sprintf('Found %d users potentially requiring a usage reset.', $usersToReset->count()));

        foreach ($usersToReset as $user) {
            // Here, we would ideally check if their usage was already reset for the current cycle.
            // For simplicity, we'll just reset if their last payment was over a month ago.
            // In a real scenario, you might add a `last_usage_reset_at` timestamp to the User model
            // and only reset if `last_usage_reset_at` is older than their last payment date + 1 month.

            $this->info(sprintf('Resetting usage for user ID: %d (%s)', $user->id, $user->email));
            $this->usageResetService->resetUsageForUser($user);
        }

        $this->info('Monthly usage reset check completed.');

        return Command::SUCCESS;
    }
}