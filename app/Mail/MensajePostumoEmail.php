<?php

namespace App\Mail;

use App\Models\MensajePostumo;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class MensajePostumoEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $mensajePostumo;

    /**
     * Create a new message instance.
     */
    public function __construct(MensajePostumo $mensajePostumo)
    {
        $this->mensajePostumo = $mensajePostumo;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Un Mensaje Especial de Parte de ' . $this->mensajePostumo->user->name,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.mensaje-postumo',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        $attachments = [];

        if ($this->mensajePostumo->ruta_archivo) {
            Log::info('Attempting to attach file: ' . $this->mensajePostumo->ruta_archivo);
            $filePath = $this->mensajePostumo->ruta_archivo;
            $disk = 'local';

            if (!\Illuminate\Support\Facades\Storage::disk($disk)->exists($filePath)) {
                Log::error(sprintf('File not found on disk %s: %s', $disk, $filePath));
                // Optionally, you might want to throw an exception or handle this more gracefully
                return $attachments; // Skip attachment if file doesn't exist
            }

            $attachments[] = \Illuminate\Mail\Mailables\Attachment::fromStorageDisk(
                $disk, // O el disco que uses para los archivos
                $filePath
            );
        }

        return $attachments;
    }
}
