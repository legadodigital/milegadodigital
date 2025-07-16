<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Un Mensaje Especial</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        .header {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
            text-align: center;
        }
        .content {
            margin-bottom: 20px;
        }
        .footer {
            font-size: 12px;
            color: #777;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            Un Mensaje Especial de {{ $mensajePostumo->user->name }}
        </div>
        <div class="content">
            <p>Hola {{ $mensajePostumo->destinatario_nombre }},</p>
            <p>{{ $mensajePostumo->user->name }} te ha dejado el siguiente mensaje a través de Mi Legado Digital:</p>
            <hr>
            <h2>{{ $mensajePostumo->titulo }}</h2>
            <p>{!! nl2br(e($mensajePostumo->mensaje)) !!}</p>
            <hr>
            <p>Si este mensaje incluye un archivo de video o audio, lo encontrarás adjunto a este correo electrónico.</p>
        </div>
        <div class="footer">
            <p>Este es un mensaje automático enviado desde la plataforma Mi Legado Virtual.</p>
            <p>&copy; {{ date('Y') }} Mi Legado Digital. Todos los derechos reservados.</p>
        </div>
    </div>
</body>
</html>
