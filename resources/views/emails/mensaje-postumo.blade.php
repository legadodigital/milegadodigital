
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Un Mensaje Especial</title>
</head>
<body style="font-family: sans-serif; background-color: #f0fdf4; color: #166534; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px;">
        <h1 style="color: #065f46;">Un Mensaje Especial para Ti</h1>
        <p>Hola,</p>
        <p>Has recibido este mensaje porque {{ $mensajePostumo->user->name }} ha querido compartir unas palabras contigo a través de Legado Digital.</p>
        <hr style="border-color: #a7f3d0;">
        <p style="white-space: pre-wrap;">{{ $mensajePostumo->mensaje }}</p>
        <hr style="border-color: #a7f3d0;">
        <p>Con cariño,</p>
        <p>El equipo de Mi Legado Virtual</p>
    </div>
</body>
</html>
