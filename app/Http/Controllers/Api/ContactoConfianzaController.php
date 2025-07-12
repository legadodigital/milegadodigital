<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactoConfianza;
use Illuminate\Http\Request;

class ContactoConfianzaController extends Controller
{
    public function index()
    {
        $contactos = ContactoConfianza::where('user_id', auth()->id())->latest()->get();
        return response()->json($contactos);
    }

    public function store(Request $request)
    {
        $user = auth()->user();

        if (!$user->is_admin && !$user->canAddTrustedContact()) {
            return response()->json(['error' => 'Has alcanzado el límite de contactos de confianza para tu plan.'], 403);
        }

        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'email' => 'required|email',
            'telefono' => 'nullable|string|max:50',
            'relacion' => 'nullable|string|max:100',
            'nivel_acceso' => 'required|in:total,limitado,emergencia',
            'notas' => 'nullable|string',
        ]);

        $contacto = ContactoConfianza::create([
            'user_id' => auth()->id(),
            'nombre' => $validated['nombre'],
            'email' => $validated['email'],
            'telefono' => $validated['telefono'],
            'relacion' => $validated['relacion'],
            'nivel_acceso' => $validated['nivel_acceso'],
            'verificado' => false,
            'token_verificacion' => null,
            'notas' => $validated['notas'],
        ]);

        // Send invitation email
        \Mail::to($contacto->email)->send(new \App\Mail\TrustedContactInvitationMail(auth()->user()->name, $contacto->nombre));

        return response()->json($contacto, 201);
    }

    public function show(ContactoConfianza $contactoConfianza)
    {
        if ($contactoConfianza->user_id !== auth()->id()) {
            return response()->json(['error' => 'No autorizado'], 403);
        }
        return response()->json($contactoConfianza);
    }

    public function update(Request $request, ContactoConfianza $contactoConfianza)
    {
        if ($contactoConfianza->user_id !== auth()->id()) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'email' => 'required|email',
            'telefono' => 'nullable|string|max:50',
            'relacion' => 'nullable|string|max:100',
            'nivel_acceso' => 'required|in:total,limitado,emergencia',
            'notas' => 'nullable|string',
        ]);

        $contactoConfianza->update([
            'nombre' => $validated['nombre'],
            'email' => $validated['email'],
            'telefono' => $validated['telefono'],
            'relacion' => $validated['relacion'],
            'nivel_acceso' => $validated['nivel_acceso'],
            'notas' => $validated['notas'],
        ]);

        return response()->json($contactoConfianza);
    }

    public function destroy(ContactoConfianza $contactoConfianza)
    {
        if ($contactoConfianza->user_id !== auth()->id()) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $contactoConfianza->delete();

        return response()->json(null, 204);
    }
}