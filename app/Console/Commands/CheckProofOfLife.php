<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\ProofOfLifeCode;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Mail\ProofOfLifeEmail;

class CheckProofOfLife extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:check-proof-of-life';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Checks users for proof of life requirement and sends emails.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $users = User::whereNotNull('proof_of_life_frequency_days')
            ->where('proof_of_life_frequency_days', '>', 0)
            ->get();

        foreach ($users as $user) {
            $lastActivity = $user->last_proof_of_life_at ?? $user->last_login_at;

            if (!$lastActivity) {
                // If no activity recorded, consider it as needing proof of life after frequency days from registration
                $lastActivity = $user->created_at;
            }

            $nextProofOfLifeDate = $lastActivity->addDays($user->proof_of_life_frequency_days);

            if (now()->greaterThanOrEqualTo($nextProofOfLifeDate)) {
                // Check if a valid, unexpired code already exists for the user
                $existingCode = ProofOfLifeCode::where('user_id', $user->id)
                    ->whereNull('used_at')
                    ->where('expires_at', '>', now())
                    ->first();

                if (!$existingCode) {
                    $code = Str::random(12);
                    $expiresAt = now()->addDays(15);

                    ProofOfLifeCode::create([
                        'user_id' => $user->id,
                        'code' => $code,
                        'expires_at' => $expiresAt,
                    ]);

                    Mail::to($user->email)->send(new ProofOfLifeEmail($user, $code));
                    $this->info('Proof of life email sent to ' . $user->email);
                } else {
                    $this->info('User ' . $user->email . ' already has an active proof of life code.');
                }
            }
        }

        $this->info('Proof of life check completed.');
    }
}