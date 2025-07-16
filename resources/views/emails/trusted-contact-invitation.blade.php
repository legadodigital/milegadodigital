<!DOCTYPE html>
<html>
<head>
    <title>Invitación a Contacto de Confianza</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { width: 80%; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        .header { text-align: center; margin-bottom: 20px; }
        .header img { max-width: 200px; }
        .content { margin-bottom: 20px; }
        .footer { text-align: center; font-size: 0.8em; color: #777; }
        .button { display: inline-block; padding: 10px 20px; margin-top: 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="{{ asset('img/logonaombre.png') }}" alt="Logo Mi Legado Digital">
            <h1>¡Hola, {{ $contactName }}!</h1>
        </div>
        <div class="content">
            <p>Te escribimos desde Mi Legado Virtual para informarte que {{ $inviterName }} te ha añadido como uno de sus contactos de confianza.</p>
            <p>Como contacto de confianza, {{ $inviterName }} ha decidido compartir contigo parte de su legado virtual, que podría incluir mensajes póstumos, documentos importantes o recuerdos preciados, para ser entregados en el futuro o en caso de necesidad.</p>
            <p>Te invitamos a unirte a nuestra plataforma para entender mejor cómo funciona y cómo puedes gestionar tu propio legado virtual, o simplemente para estar preparado para cuando {{ $inviterName }} necesite que accedas a su información.</p>
            <p>Puedes visitar nuestra plataforma aquí:</p>
            <p style="text-align: center;">
                <a href="https://www.milegadovirtual.cl" class="button">Visitar Mi Legado Virtual</a>
            </p>
            <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
            <p>Saludos cordiales,</p>
            <p>El equipo de Mi Legado Virtual</p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} Mi Legado Virtual. Todos los derechos reservados.</p>
        </div>
    </div>
</body>
</html>
