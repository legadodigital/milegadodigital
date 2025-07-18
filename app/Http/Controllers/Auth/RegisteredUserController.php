<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Plan;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Mail;
use App\Mail\WelcomeEmail;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        $plans = \App\Models\Plan::orderBy('price')->get();
        return Inertia::render('Auth/Register', [
            'plans' => $plans,
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): Response|RedirectResponse
    {

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'plan_id' => 'required|exists:plans,id',
            'billing_cycle' => 'required|in:monthly,annually',
        ]);

        $plan = Plan::findOrFail($request->plan_id);

        if ($plan->price > 0) {
            // Store registration data in session for later retrieval after payment
            $request->session()->put('registration_data', [
                'name' => $request->name,
                'email' => $request->email,
                'password' => $request->password,
                'plan_id' => $request->plan_id,
                'billing_cycle' => $request->billing_cycle,
            ]);

            // Redirect to a route that initiates Transbank payment
            return Inertia::render('PaymentRedirect', ['plan_id' => $plan->id, 'billing_cycle' => $request->billing_cycle]);
        }

        // For free plans, proceed with user creation and login
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'plan_id' => $request->plan_id,
        ]);

        event(new Registered($user));

        Auth::login($user);

        // Send welcome email
        $logoUrl = asset('img/logonaombre.png'); // Adjust path as needed
        Mail::to($user->email)->send(new WelcomeEmail($user->name, $logoUrl));

        return redirect(route('dashboard', absolute: false));
    }
}
