<?php

namespace App\Http\Controllers;

use App\Models\Recuerdo;
use App\Models\RecuerdoMedia;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use App\Traits\HasUsageTracking;

class RecuerdoController extends Controller
{
    use HasUsageTracking;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $recuerdos = Recuerdo::with('media')->where('user_id', auth()->id())->latest()->get();
        return Inertia::render('Recuerdos/Index', [
            'recuerdos' => $recuerdos,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Recuerdos/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = auth()->user();

        if (!$this->canPerformAction($user, 'max_memories')) {
            return redirect()->back()->withErrors(['limit' => 'Has alcanzado el límite de recuerdos para tu plan.']);
        }

        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'historia' => 'required|string',
            'ubicacion' => 'nullable|string|max:255',
            'fecha_recuerdo' => 'nullable|date',
            'visibilidad' => 'required|in:privado,contactos,publico',
            'archivos' => 'nullable|array',
            'archivos.*' => 'file|mimes:jpeg,png,jpg,gif,mp3,wav,aac|max:20480', // 20MB max
        ]);

        $recuerdo = Recuerdo::create([
            'user_id' => auth()->id(),
            'titulo' => $validated['titulo'],
            'historia' => $validated['historia'],
            'ubicacion' => $validated['ubicacion'],
            'fecha_recuerdo' => $validated['fecha_recuerdo'],
            'visibilidad' => $validated['visibilidad'],
        ]);

        $this->incrementUsage($user, 'max_memories');

        if ($request->hasFile('archivos')) {
            foreach ($request->file('archivos') as $file) {
                $rutaArchivo = $file->store('recuerdos_media', 'public');
                $tipoMedia = $this->getMediaType($file->getMimeType());

                $recuerdo->media()->create([
                    'ruta_archivo' => $rutaArchivo,
                    'tipo_media' => $tipoMedia,
                    'descripcion' => null, // Puedes añadir un campo para descripción de media si lo necesitas
                ]);
            }
        }

        return redirect()->route('recuerdos.index')->with('success', 'Recuerdo creado exitosamente.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Recuerdo $recuerdo)
    {
        if ($recuerdo->user_id !== auth()->id()) {
            abort(403);
        }
        $recuerdo->load('media');
        return Inertia::render('Recuerdos/Edit', [
            'recuerdo' => $recuerdo,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Recuerdo $recuerdo)
    {
        if ($recuerdo->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'historia' => 'required|string',
            'ubicacion' => 'nullable|string|max:255',
            'fecha_recuerdo' => 'nullable|date',
            'visibilidad' => 'required|in:privado,contactos,publico',
            'archivos' => 'nullable|array',
            'archivos.*' => 'file|mimes:jpeg,png,jpg,gif,mp3,wav,aac|max:20480', // 20MB max
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

        // Eliminar archivos que no están en archivos_existentes_ids
        $archivosAEliminar = $recuerdo->media->whereNotIn('id', $validated['archivos_existentes_ids'] ?? [])->pluck('ruta_archivo');
        foreach ($archivosAEliminar as $ruta) {
            Storage::disk('public')->delete($ruta);
        }
        $recuerdo->media()->whereNotIn('id', $validated['archivos_existentes_ids'] ?? [])->delete();

        // Añadir nuevos archivos
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

        return redirect()->route('recuerdos.index')->with('success', 'Recuerdo actualizado exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Recuerdo $recuerdo)
    {
        if ($recuerdo->user_id !== auth()->id()) {
            abort(403);
        }

        // Eliminar archivos multimedia asociados
        foreach ($recuerdo->media as $media) {
            Storage::disk('public')->delete($media->ruta_archivo);
        }
        $recuerdo->media()->delete();

        $recuerdo->delete();

        return redirect()->route('recuerdos.index')->with('success', 'Recuerdo eliminado exitosamente.');
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
