<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DocumentoImportante;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DocumentoImportanteController extends Controller
{
    public function index()
    {
        $documentos = DocumentoImportante::where('user_id', auth()->id())->latest()->get();
        return response()->json($documentos);
    }

    public function store(Request $request)
    {
        $user = auth()->user();

        if (!$user->is_admin && !$user->canUploadDocument()) {
            return response()->json(['error' => 'Has alcanzado el límite de documentos importantes para tu plan.'], 403);
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

        $documento = DocumentoImportante::create([
            'user_id' => auth()->id(),
            'titulo' => $validated['titulo'],
            'descripcion' => $validated['descripcion'],
            'categoria' => $validated['categoria'],
            'nivel_acceso' => $validated['nivel_acceso'],
            'ruta_archivo' => $rutaArchivo,
            'tipo_archivo' => $tipoArchivo,
            'tamano_archivo' => $tamanoArchivo,
            'is_encrypted' => false,
            'encryption_key' => null,
        ]);

        return response()->json($documento, 201);
    }

    public function show(DocumentoImportante $documentoImportante)
    {
        if ($documentoImportante->user_id !== auth()->id()) {
            return response()->json(['error' => 'No autorizado'], 403);
        }
        return response()->json($documentoImportante);
    }

    public function update(Request $request, DocumentoImportante $documentoImportante)
    {
        if ($documentoImportante->user_id !== auth()->id()) {
            return response()->json(['error' => 'No autorizado'], 403);
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

        return response()->json($documentoImportante);
    }

    public function destroy(DocumentoImportante $documentoImportante)
    {
        if ($documentoImportante->user_id !== auth()->id()) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        if ($documentoImportante->ruta_archivo) {
            Storage::disk('public')->delete($documentoImportante->ruta_archivo);
        }

        $documentoImportante->delete();

        return response()->json(null, 204);
    }

    public function download(DocumentoImportante $documentoImportante)
    {
        if ($documentoImportante->user_id !== auth()->id()) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        if (Storage::disk('public')->exists($documentoImportante->ruta_archivo)) {
            return Storage::disk('public')->download($documentoImportante->ruta_archivo, $documentoImportante->titulo . '.' . pathinfo($documentoImportante->ruta_archivo, PATHINFO_EXTENSION));
        }

        return response()->json(['error' => 'Archivo no encontrado.'], 404);
    }
}