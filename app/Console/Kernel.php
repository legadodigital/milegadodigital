<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use App\Console\Commands\EnviarMensajesPostumos;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        \Illuminate\Support\Facades\Log::info('Scheduler running at: ' . \Carbon\Carbon::now()->toDateTimeString() . ' (' . \Carbon\Carbon::now()->timezoneName . ')');

        $schedule->command(EnviarMensajesPostumos::class)->everyMinute();
        $schedule->command('app:check-proof-of-life')->daily();
    }

    /**
     * Register the commands for the application.
     */
    protected $commands = [
        \App\Console\Commands\EnviarMensajesPostumos::class,
    ];

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
