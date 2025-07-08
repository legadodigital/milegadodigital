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
        $newPlan = Plan::findOrFail($request->plan_id);

        // If the new plan is free or the user is already on this plan, update directly
        if ($newPlan->price == 0 || $user->plan_id === $newPlan->id) {
            $user->plan_id = $newPlan->id;
            $user->save();
            return Redirect::route('profile.edit')->with('status', 'Plan actualizado exitosamente.');
        } else {
            // For paid plans, initiate Transbank payment
            $request->session()->put('upgrade_plan_data', [
                'user_id' => $user->id,
                'new_plan_id' => $newPlan->id,
            ]);
            return Inertia::render('PaymentRedirect', ['plan_id' => $newPlan->id]);
        }
    }

    /**
     * Display the plan upgrade form.
     */
    public function showUpgradePlanForm(Request $request): Response
    {
        $plans = Plan::with('features')->get();
        return Inertia::render('Profile/UpgradePlan', [
            'availablePlans' => $plans,
            'currentPlanId' => $request->user()->plan_id,
            'oneclickInscriptions' => $request->user()->oneclickInscriptions()->get(),
        ]);
    }

    /**
     * Display the Oneclick management form.
     */
    public function showOneclickManagement(Request $request): Response
    {
        $inscriptions = $request->user()->oneclickInscriptions()->get();
        return Inertia::render('Profile/OneclickManagement', [
            'inscriptions' => $inscriptions,
        ]);
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
