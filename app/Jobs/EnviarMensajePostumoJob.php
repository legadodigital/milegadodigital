<?php

namespace App\Jobs;

use App\Models\MensajePostumo;
use App\Mail\MensajePostumoEmail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class EnviarMensajePostumoJob
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     *
     * @var int
     */
    public $tries = 3;

    /**
     * The message instance.
     *
     * @var \App\Models\MensajePostumo
     */
    public $mensaje;

    /**
     * Create a new job instance.
     *
     * @param \App\Models\MensajePostumo $mensaje
     * @return void
     */
    public function __construct(MensajePostumo $mensaje)
    {
        $this->mensaje = $mensaje;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle(): void
    {
        try {
            Mail::to($this->mensaje->destinatario_email)->send(new MensajePostumoEmail($this->mensaje));

            $this->mensaje->update([
                'estado' => 'enviado',
                'delivered_at' => Carbon::now(),
            ]);

            Log::info(sprintf('Mensaje póstumo ID %d enviado a %s', $this->mensaje->id, $this->mensaje->destinatario_email));

        } catch (\Exception $e) {
            Log::error(sprintf('Error al procesar el job para el mensaje póstumo ID %d: %s', $this->mensaje->id, $e->getMessage()));
            // The job will be automatically re-released if it fails and tries are left.
            $this->fail($e);
        }
    }
}
