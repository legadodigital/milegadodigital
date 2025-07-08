<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TrustedContactInvitationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $inviterName;
    public $contactName;

    /**
     * Create a new message instance.
     */
    public function __construct(string $inviterName, string $contactName)
    {
        $this->inviterName = $inviterName;
        $this->contactName = $contactName;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Has sido añadido como Contacto de Confianza en Mi Legado Virtual',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.trusted-contact-invitation',
            with: [
                'inviterName' => $this->inviterName,
                'contactName' => $this->contactName,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
