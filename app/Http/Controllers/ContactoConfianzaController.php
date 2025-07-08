<?php

namespace App\Http\Controllers;

use App\Models\ContactoConfianza;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactoConfianzaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $contactos = ContactoConfianza::where('user_id', auth()->id())->latest()->get();
        return Inertia::render('ContactosConfianza/Index', [
            'contactos' => $contactos,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('ContactosConfianza/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = auth()->user();

        if (!$user->is_admin && !$user->canAddTrustedContact()) {
            return redirect()->back()->withErrors(['limit' => 'Has alcanzado el límite de contactos de confianza para tu plan.']);
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
            'verificado' => false, // Por defecto, no verificado al crear
            'token_verificacion' => null, // Se generaría al enviar email de verificación
            'notas' => $validated['notas'],
        ]);

        // Send invitation email
        \Mail::to($contacto->email)->send(new \App\Mail\TrustedContactInvitationMail(auth()->user()->name, $contacto->nombre));

        return redirect()->route('contactos-confianza.index')->with('success', 'Contacto de confianza creado exitosamente y correo de invitación enviado.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ContactoConfianza $contactoConfianza)
    {
        if ($contactoConfianza->user_id !== auth()->id()) {
            abort(403);
        }
        return Inertia::render('ContactosConfianza/Edit', [
            'contacto' => $contactoConfianza,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ContactoConfianza $contactoConfianza)
    {
        if ($contactoConfianza->user_id !== auth()->id()) {
            abort(403);
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

        return redirect()->route('contactos-confianza.index')->with('success', 'Contacto de confianza actualizado exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ContactoConfianza $contactoConfianza)
    {
        if ($contactoConfianza->user_id !== auth()->id()) {
            abort(403);
        }

        $contactoConfianza->delete();

        return redirect()->route('contactos-confianza.index')->with('success', 'Contacto de confianza eliminado exitosamente.');
    }
}
