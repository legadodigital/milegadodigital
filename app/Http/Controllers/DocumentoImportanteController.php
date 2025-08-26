<?php

namespace App\Http\Controllers;

use App\Models\DocumentoImportante;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use App\Traits\HasUsageTracking;

class DocumentoImportanteController extends Controller
{
    use HasUsageTracking;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $documentos = DocumentoImportante::where('user_id', auth()->id())->latest()->get();
        return Inertia::render('DocumentosImportantes/Index', [
            'documentos' => $documentos,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('DocumentosImportantes/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = auth()->user();

        if (!$this->canPerformAction($user, 'max_documents')) {
            return redirect()->back()->withErrors(['limit' => 'Has alcanzado el límite de documentos importantes para tu plan.']);
        }

        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'categoria' => 'required|string|max:50',
            'nivel_acceso' => 'required|in:privado,confianza,publico',
            'archivo' => 'required|file|max:204800', // 200MB max
        ]);

        $rutaArchivo = null;
        $tipoArchivo = null;
        $tamanoArchivo = null;

        if ($request->hasFile('archivo')) {
            $file = $request->file('archivo');
            $rutaArchivo = $file->store('documentos_importantes', 'public');
            $tipoArchivo = $file->getMimeType();
            $tamanoArchivo = $file->getSize();
        }

        DocumentoImportante::create([
            'user_id' => auth()->id(),
            'titulo' => $validated['titulo'],
            'descripcion' => $validated['descripcion'],
            'categoria' => $validated['categoria'],
            'nivel_acceso' => $validated['nivel_acceso'],
            'ruta_archivo' => $rutaArchivo,
            'tipo_archivo' => $tipoArchivo,
            'tamano_archivo' => $tamanoArchivo,
            'is_encrypted' => false, // Por ahora, asumimos que no está encriptado al subir
            'encryption_key' => null,
        ]);

        $this->incrementUsage($user, 'max_documents');

        return redirect()->route('documentos-importantes.index')->with('success', 'Documento creado exitosamente.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(DocumentoImportante $documentoImportante)
    {
        if ($documentoImportante->user_id !== auth()->id()) {
            abort(403);
        }
        return Inertia::render('DocumentosImportantes/Edit', [
            'documento' => $documentoImportante,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, DocumentoImportante $documentoImportante)
    {
        if ($documentoImportante->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'categoria' => 'required|string|max:50',
            'nivel_acceso' => 'required|in:privado,confianza,publico',
            'archivo' => 'nullable|file|max:204800', // 200MB max
        ]);

        $rutaArchivo = $documentoImportante->ruta_archivo;
        $tipoArchivo = $documentoImportante->tipo_archivo;
        $tamanoArchivo = $documentoImportante->tamano_archivo;

        if ($request->hasFile('archivo')) {
            // Eliminar archivo antiguo si existe
            if ($rutaArchivo) {
                Storage::disk('public')->delete($rutaArchivo);
            }
            $file = $request->file('archivo');
            $rutaArchivo = $file->store('documentos_importantes', 'public');
            $tipoArchivo = $file->getMimeType();
            $tamanoArchivo = $file->getSize();
        }

        $documentoImportante->update([
            'titulo' => $validated['titulo'],
            'descripcion' => $validated['descripcion'],
            'categoria' => $validated['categoria'],
            'nivel_acceso' => $validated['nivel_acceso'],
            'ruta_archivo' => $rutaArchivo,
            'tipo_archivo' => $tipoArchivo,
            'tamano_archivo' => $tamanoArchivo,
        ]);

        return redirect()->route('documentos-importantes.index')->with('success', 'Documento actualizado exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DocumentoImportante $documentoImportante)
    {
        if ($documentoImportante->user_id !== auth()->id()) {
            abort(403);
        }

        // Eliminar archivo asociado si existe
        if ($documentoImportante->ruta_archivo) {
            Storage::disk('public')->delete($documentoImportante->ruta_archivo);
        }

        $documentoImportante->delete();

        return redirect()->route('documentos-importantes.index')->with('success', 'Documento eliminado exitosamente.');
    }

    /**
     * Download the specified resource.
     */
    public function download(DocumentoImportante $documentoImportante)
    {
        if ($documentoImportante->user_id !== auth()->id()) {
            abort(403);
        }

        if (Storage::disk('public')->exists($documentoImportante->ruta_archivo)) {
            return Storage::disk('public')->download($documentoImportante->ruta_archivo, $documentoImportante->titulo . '.' . pathinfo($documentoImportante->ruta_archivo, PATHINFO_EXTENSION));
        }

        abort(404, 'Archivo no encontrado.');
    }
}
