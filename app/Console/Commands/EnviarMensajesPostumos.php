<?php

namespace App\Console\Commands;

use App\Models\MensajePostumo;
use App\Mail\MensajePostumoEmail;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class EnviarMensajesPostumos extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:enviar-mensajes-postumos';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Envía los mensajes póstumos cuya fecha de entrega ha llegado.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Buscando mensajes póstumos pendientes para encolar...');

        $now = Carbon::now();
        $this->info(sprintf('Current time (Carbon::now()): %s', $now->toDateTimeString()));

        $mensajesParaEnviar = MensajePostumo::where('estado', 'pendiente')
            ->where('fecha_entrega', '<=', $now)
            ->get();

        $this->info(sprintf('Querying for messages where fecha_entrega <= %s', $now->toDateTimeString()));
        $this->info(sprintf('Found %d messages matching criteria.', $mensajesParaEnviar->count()));

        if ($mensajesParaEnviar->isEmpty()) {
            $this->info('No se encontraron mensajes póstumos para enviar hoy.');
            return Command::SUCCESS;
        }

        $this->info(sprintf('Se encontraron %d mensajes póstumos. Encolando jobs...', $mensajesParaEnviar->count()));

        foreach ($mensajesParaEnviar as $mensaje) {
            try {
                // Despachar un job por cada mensaje
                \App\Jobs\EnviarMensajePostumoJob::dispatch($mensaje);
                $this->info(sprintf('Job encolado para el mensaje ID %d.', $mensaje->id));
            } catch (\Exception $e) {
                $this->error(sprintf('Error al encolar el job para el mensaje ID %d: %s', $mensaje->id, $e->getMessage()));
            }
        }

        $this->info('Proceso de encolado de mensajes póstumos completado.');

        return Command::SUCCESS;
    }
}
