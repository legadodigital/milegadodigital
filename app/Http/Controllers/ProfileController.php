<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\ConfiguracionSeguridad;
use App\Models\Plan;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();
        $user->load('plan.features'); // Load user's current plan with its features

        $plans = Plan::with('features')->get(); // Get all available plans with their features

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => session('status'),
            'userPlan' => $user->plan, // Pass the user's current plan
            'availablePlans' => $plans, // Pass all available plans
        ]);
    }

    /**
     * Update the user's plan.
     */
    public function updatePlan(Request $request): RedirectResponse
    {
        $request->validate([
            'plan_id' => ['required', 'exists:plans,id'],
        ]);

        $user = $request->user();
        $user->plan_id = $request->plan_id;
        $user->save();

        return Redirect::route('profile.edit')->with('status', 'Plan actualizado exitosamente.');
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Display the user's security settings form.
     */
    public function security(Request $request): Response
    {
        $configuracionSeguridad = $request->user()->configuracionSeguridad;

        if (!$configuracionSeguridad) {
            $configuracionSeguridad = ConfiguracionSeguridad::create([
                'user_id' => $request->user()->id,
            ]);
        }

        return Inertia::render('Profile/Security', [
            'configuracionSeguridad' => $configuracionSeguridad,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's security settings.
     */
    public function updateSecurity(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'session_timeout' => 'required|integer|min:60',
            'biometria_habilitada' => 'boolean',
            'nivel_encriptacion' => 'required|in:AES-128,AES-256',
        ]);

        $configuracionSeguridad = $request->user()->configuracionSeguridad;

        if (!$configuracionSeguridad) {
            $configuracionSeguridad = ConfiguracionSeguridad::create([
                'user_id' => $request->user()->id,
            ]);
        }

        $configuracionSeguridad->update($validated);

        return Redirect::route('profile.security')->with('status', 'Configuración de seguridad actualizada.');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
