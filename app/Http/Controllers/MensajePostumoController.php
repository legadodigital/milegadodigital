<?php

namespace App\Http\Controllers;

use App\Models\MensajePostumo;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class MensajePostumoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $mensajes = MensajePostumo::where('user_id', auth()->id())->latest()->get();
        return Inertia::render('MensajesPostumos/Index', [
            'mensajes' => $mensajes,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('MensajesPostumos/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = auth()->user();

        if (!$user->is_admin && !$user->canCreateMessage()) {
            return redirect()->back()->withErrors(['limit' => 'Has alcanzado el límite de mensajes póstumos para tu plan.']);
        }

        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'contenido' => 'nullable|string',
            'tipo_mensaje' => 'required|in:texto,video,audio',
            'destinatario_email' => 'required|email',
            'destinatario_nombre' => 'nullable|string|max:255',
            'fecha_entrega' => 'required|date',
            'archivo' => 'nullable|file|mimes:jpeg,png,gif,bmp,svg,webp,mp4,mov,ogg,qt,mp3,wav,aac|max:20480', // 20MB max
            'temp_video_path' => 'nullable|string',
        ]);

        $rutaArchivo = null;
        $tipoArchivoMedia = null;

        if ($request->hasFile('archivo')) {
            $file = $request->file('archivo');
            $rutaArchivo = $file->store('mensajes_postumos', 'public');
            $tipoArchivoMedia = $this->getMediaType($file->getMimeType());
        } elseif ($request->filled('temp_video_path')) {
            $tempPath = $request->input('temp_video_path');
            // Ensure the file exists in temp storage
            if (Storage::disk('public')->exists($tempPath)) {
                $fileName = basename($tempPath);
                $newPath = 'mensajes_postumos/' . $fileName;
                Storage::disk('public')->move($tempPath, $newPath);
                $rutaArchivo = $newPath;
                $tipoArchivoMedia = $this->getMediaType(Storage::disk('public')->mimeType($newPath));
            }
        }

        MensajePostumo::create([
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

        return redirect()->route('mensajes-postumos.index')->with('success', 'Mensaje póstumo creado exitosamente.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(MensajePostumo $mensajePostumo)
    {
        if ($mensajePostumo->user_id !== auth()->id()) {
            abort(403);
        }
        return Inertia::render('MensajesPostumos/Edit', [
            'mensaje' => $mensajePostumo,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, MensajePostumo $mensajePostumo)
    {
        if ($mensajePostumo->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'contenido' => 'nullable|string',
            'tipo_mensaje' => 'required|in:texto,video,audio',
            'destinatario_email' => 'required|email',
            'destinatario_nombre' => 'nullable|string|max:255',
            'fecha_entrega' => 'required|date',
            'archivo' => 'nullable|file|mimes:jpeg,png,gif,bmp,svg,webp,mp4,mov,ogg,qt,mp3,wav,aac|max:20480', // 20MB max
        ]);

        $rutaArchivo = $mensajePostumo->ruta_archivo;
        $tipoArchivoMedia = $mensajePostumo->tipo_archivo_media;

        if ($request->hasFile('archivo')) {
            // Eliminar archivo antiguo si existe
            if ($rutaArchivo) {
                Storage::disk('local')->delete($rutaArchivo);
            }
            $file = $request->file('archivo');
            $rutaArchivo = $file->store('mensajes_postumos', 'local');
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

        return redirect()->route('mensajes-postumos.index')->with('success', 'Mensaje póstumo actualizado exitosamente.');
    }

    public function uploadVideoTemp(Request $request)
    {
        $request->validate([
            'video' => 'required|file|mimetypes:video/*|max:20480', // Max 20MB (20480 KB)
        ]);

        $path = $request->file('video')->store('temp/videos', 'public');

        return response()->json([
            'temp_video_path' => $path,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MensajePostumo $mensajePostumo)
    {
        if ($mensajePostumo->user_id !== auth()->id()) {
            abort(403);
        }

        // Eliminar archivo asociado si existe
        if ($mensajePostumo->ruta_archivo) {
            Storage::disk('local')->delete($mensajePostumo->ruta_archivo);
        }

        $mensajePostumo->delete();

        return redirect()->route('mensajes-postumos.index')->with('success', 'Mensaje póstumo eliminado exitosamente.');
    }

    /**
     * Get media type from mime type.
     */
    private function getMediaType(string $mimeType): ?string
    {
        if (str_starts_with($mimeType, 'video/')) {
            return 'video';
        } elseif (str_starts_with($mimeType, 'audio/')) {
            return 'audio';
        } elseif (str_starts_with($mimeType, 'image/')) {
            return 'imagen';
        }
        return null;
    }
}
