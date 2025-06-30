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
        $this->info('Buscando mensajes póstumos pendientes para enviar...');

        $mensajesPendientes = MensajePostumo::where('estado', 'pendiente')
            ->where('fecha_entrega', '<=', Carbon::now())
            ->get();

        if ($mensajesPendientes->isEmpty()) {
            $this->info('No se encontraron mensajes póstumos pendientes para enviar.');
            return Command::SUCCESS;
        }

        $this->info(sprintf('Se encontraron %d mensajes póstumos pendientes.', $mensajesPendientes->count()));

        foreach ($mensajesPendientes as $mensaje) {
            try {
                Mail::to($mensaje->destinatario_email)->send(new MensajePostumoEmail($mensaje));
                $this->info(sprintf('Enviando mensaje "%s" a %s.', $mensaje->titulo, $mensaje->destinatario_email));

                $mensaje->update([
                    'estado' => 'enviado',
                    'delivered_at' => Carbon::now(),
                ]);

                $this->info('Mensaje marcado como enviado.');
            } catch (\Exception $e) {
                $this->error(sprintf('Error al enviar el mensaje %d: %s', $mensaje->id, $e->getMessage()));
            }
        }

        $this->info('Proceso de envío de mensajes póstumos completado.');

        return Command::SUCCESS;
    }
}
