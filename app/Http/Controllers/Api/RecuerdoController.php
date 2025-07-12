<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Recuerdo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class RecuerdoController extends Controller
{
    public function index()
    {
        $recuerdos = Recuerdo::with('media')->where('user_id', auth()->id())->latest()->get();
        return response()->json($recuerdos);
    }

    public function store(Request $request)
    {
        $user = auth()->user();

        if (!$user->is_admin) {
            $plan = $user->plan->load('features');
            $maxMemories = $plan->features->where('feature_code', 'max_memories')->first()->value ?? 0;

            if ($maxMemories !== 'ilimitado' && $user->recuerdos()->count() >= (int)$maxMemories) {
                return response()->json(['error' => 'Has alcanzado el límite de recuerdos para tu plan.'], 403);
            }
        }

        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'historia' => 'required|string',
            'ubicacion' => 'nullable|string|max:255',
            'fecha_recuerdo' => 'nullable|date',
            'visibilidad' => 'required|in:privado,contactos,publico',
            'archivos' => 'nullable|array',
            'archivos.*' => 'file|mimes:jpeg,png,jpg,gif,mp4,mov,ogg,qt,mp3,wav,aac|max:204800',
        ]);

        $recuerdo = Recuerdo::create([
            'user_id' => auth()->id(),
            'titulo' => $validated['titulo'],
            'historia' => $validated['historia'],
            'ubicacion' => $validated['ubicacion'],
            'fecha_recuerdo' => $validated['fecha_recuerdo'],
            'visibilidad' => $validated['visibilidad'],
        ]);

        if ($request->hasFile('archivos')) {
            foreach ($request->file('archivos') as $file) {
                $rutaArchivo = $file->store('recuerdos_media', 'public');
                $tipoMedia = $this->getMediaType($file->getMimeType());

                $recuerdo->media()->create([
                    'ruta_archivo' => $rutaArchivo,
                    'tipo_media' => $tipoMedia,
                    'descripcion' => null,
                ]);
            }
        }

        return response()->json($recuerdo->load('media'), 201);
    }

    public function show(Recuerdo $recuerdo)
    {
        if ($recuerdo->user_id !== auth()->id()) {
            return response()->json(['error' => 'No autorizado'], 403);
        }
        return response()->json($recuerdo->load('media'));
    }

    public function update(Request $request, Recuerdo $recuerdo)
    {
        if ($recuerdo->user_id !== auth()->id()) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'historia' => 'required|string',
            'ubicacion' => 'nullable|string|max:255',
            'fecha_recuerdo' => 'nullable|date',
            'visibilidad' => 'required|in:privado,contactos,publico',
            'archivos' => 'nullable|array',
            'archivos.*' => 'file|mimes:jpeg,png,jpg,gif,mp4,mov,ogg,qt,mp3,wav,aac|max:204800',
            'archivos_existentes_ids' => 'nullable|array',
            'archivos_existentes_ids.*' => 'exists:recuerdos_media,id',
        ]);

        $recuerdo->update([
            'titulo' => $validated['titulo'],
            'historia' => $validated['historia'],
            'ubicacion' => $validated['ubicacion'],
            'fecha_recuerdo' => $validated['fecha_recuerdo'],
            'visibilidad' => $validated['visibilidad'],
        ]);

        $archivosAEliminar = $recuerdo->media->whereNotIn('id', $validated['archivos_existentes_ids'] ?? [])->pluck('ruta_archivo');
        foreach ($archivosAEliminar as $ruta) {
            Storage::disk('public')->delete($ruta);
        }
        $recuerdo->media()->whereNotIn('id', $validated['archivos_existentes_ids'] ?? [])->delete();

        if ($request->hasFile('archivos')) {
            foreach ($request->file('archivos') as $file) {
                $rutaArchivo = $file->store('recuerdos_media', 'public');
                $tipoMedia = $this->getMediaType($file->getMimeType());

                $recuerdo->media()->create([
                    'ruta_archivo' => $rutaArchivo,
                    'tipo_media' => $tipoMedia,
                    'descripcion' => null,
                ]);
            }
        }

        return response()->json($recuerdo->load('media'));
    }

    public function destroy(Recuerdo $recuerdo)
    {
        if ($recuerdo->user_id !== auth()->id()) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        foreach ($recuerdo->media as $media) {
            Storage::disk('public')->delete($media->ruta_archivo);
        }
        $recuerdo->media()->delete();

        $recuerdo->delete();

        return response()->json(null, 204);
    }

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