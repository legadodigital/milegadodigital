<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\ProofOfLifeCode;
use Illuminate\Support\Facades\Auth;

class ProofOfLifeController extends Controller
{
    public function showForm()
    {
        return Inertia::render('ProofOfLife/Verify');
    }

    public function verifyCode(Request $request)
    {
        $request->validate([
            'code' => 'required|string|min:12',
        ]);

        $user = Auth::user();

        $code = ProofOfLifeCode::where('user_id', $user->id)
            ->where('code', $request->code)
            ->whereNull('used_at')
            ->where('expires_at', '>', now())
            ->first();

        if (!$code) {
            return redirect()->back()->withErrors(['code' => 'El código ingresado es inválido, ha expirado o ya ha sido utilizado.']);
        }

        // Mark code as used
        $code->used_at = now();
        $code->save();

        // Update user's last_proof_of_life_at
        $user->last_proof_of_life_at = now();
        $user->save();

        return redirect()->route('dashboard')->with('success', '¡Prueba de vida verificada exitosamente!');
    }

    public function showSettings()
    {
        $user = Auth::user();
        return Inertia::render('ProofOfLife/Settings', [
            'proofOfLifeFrequencyDays' => $user->proof_of_life_frequency_days,
        ]);
    }

    public function updateSettings(Request $request)
    {
        $request->validate([
            'proof_of_life_frequency_days' => 'required|integer|min:0',
        ]);

        $user = Auth::user();
        $user->proof_of_life_frequency_days = $request->proof_of_life_frequency_days;
        $user->save();

        return redirect()->back()->with('success', 'Configuración de prueba de vida actualizada exitosamente.');
    }
}