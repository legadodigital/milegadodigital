<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MensajePostumo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MensajePostumoController extends Controller
{
    public function index()
    {
        $mensajes = MensajePostumo::where('user_id', auth()->id())->latest()->get();
        return response()->json($mensajes);
    }

    public function store(Request $request)
    {
        $user = auth()->user();

        if (!$user->is_admin && !$user->canCreateMessage()) {
            return response()->json(['error' => 'Has alcanzado el límite de mensajes póstumos para tu plan.'], 403);
        }

        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'contenido' => 'nullable|string',
            'tipo_mensaje' => 'required|in:texto,video,audio',
            'destinatario_email' => 'required|email',
            'destinatario_nombre' => 'nullable|string|max:255',
            'fecha_entrega' => 'required|date',
            'archivo' => 'nullable|file|mimes:mp4,mov,ogg,qt,mp3,wav,aac|max:204800', // 200MB max
        ]);

        $rutaArchivo = null;
        $tipoArchivoMedia = null;

        if ($request->hasFile('archivo')) {
            $file = $request->file('archivo');
            $rutaArchivo = $file->store('mensajes_postumos', 'public');
            $tipoArchivoMedia = $this->getMediaType($file->getMimeType());
        }

        $mensaje = MensajePostumo::create([
            'user_id' => auth()->id(),
            'titulo' => $validated['titulo'],
            'contenido' => $validated['contenido'],
            'tipo_mensaje' => $validated['tipo_mensaje'],
            'destinatario_email' => $validated['destinatario_email'],
            'destinatario_nombre' => $validated['destinatario_nombre'],
            'fecha_entrega' => $validated['fecha_entrega'],
            'ruta_archivo' => $rutaArchivo,
            'tipo_archivo_media' => $tipoArchivoMedia,
            'estado' => 'pendiente',
        ]);

        return response()->json($mensaje, 201);
    }

    public function show(MensajePostumo $mensajePostumo)
    {
        if ($mensajePostumo->user_id !== auth()->id()) {
            return response()->json(['error' => 'No autorizado'], 403);
        }
        return response()->json($mensajePostumo);
    }

    public function update(Request $request, MensajePostumo $mensajePostumo)
    {
        if ($mensajePostumo->user_id !== auth()->id()) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'contenido' => 'nullable|string',
            'tipo_mensaje' => 'required|in:texto,video,audio',
            'destinatario_email' => 'required|email',
            'destinatario_nombre' => 'nullable|string|max:255',
            'fecha_entrega' => 'required|date',
            'archivo' => 'nullable|file|mimes:mp4,mov,ogg,qt,mp3,wav,aac|max:204800', // 200MB max
        ]);

        $rutaArchivo = $mensajePostumo->ruta_archivo;
        $tipoArchivoMedia = $mensajePostumo->tipo_archivo_media;

        if ($request->hasFile('archivo')) {
            if ($rutaArchivo) {
                Storage::disk('public')->delete($rutaArchivo);
            }
            $file = $request->file('archivo');
            $rutaArchivo = $file->store('mensajes_postumos', 'public');
            $tipoArchivoMedia = $this->getMediaType($file->getMimeType());
        }

        $mensajePostumo->update([
            'titulo' => $validated['titulo'],
            'contenido' => $validated['contenido'],
            'tipo_mensaje' => $validated['tipo_mensaje'],
            'destinatario_email' => $validated['destinatario_email'],
            'destinatario_nombre' => $validated['destinatario_nombre'],
            'fecha_entrega' => $validated['fecha_entrega'],
            'ruta_archivo' => $rutaArchivo,
            'tipo_archivo_media' => $tipoArchivoMedia,
        ]);

        return response()->json($mensajePostumo);
    }

    public function destroy(MensajePostumo $mensajePostumo)
    {
        if ($mensajePostumo->user_id !== auth()->id()) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        if ($mensajePostumo->ruta_archivo) {
            Storage::disk('public')->delete($mensajePostumo->ruta_archivo);
        }

        $mensajePostumo->delete();

        return response()->json(null, 204);
    }

    private function getMediaType(string $mimeType): ?string
    {
        if (str_starts_with($mimeType, 'video/')) {
            return 'video';
        } elseif (str_starts_with($mimeType, 'audio/')) {
            return 'audio';
        }
        return null;
    }
}