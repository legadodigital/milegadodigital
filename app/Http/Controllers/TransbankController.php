<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Transbank\Webpay\WebpayPlus\Transaction;
use Transbank\Webpay\Oneclick\MallInscription;
use Transbank\Webpay\Oneclick\MallTransaction;
use App\Models\Plan;
use App\Models\User;
use App\Models\OneclickInscription;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Auth\Events\Registered;
use Inertia\Inertia;

class TransbankController extends Controller
{
    public function initiateWebpayTransaction(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:plans,id',
        ]);

        $plan = Plan::findOrFail($request->plan_id);
        $amount = $plan->price;
        $buyOrder = 'order-' . uniqid();
        $sessionId = 'session-' . uniqid();
        $returnUrl = route('webpay.return');

        $transaction = new Transaction();
        $transaction->configureForIntegration(config('services.transbank.webpay_plus.commerce_code'), config('services.transbank.webpay_plus.api_key'));
        $response = $transaction->create($buyOrder, $sessionId, $amount, $returnUrl);

        return Inertia::location($response->getUrl() . '?token_ws=' . $response->getToken());
    }

    public function returnFromWebpay(Request $request)
    {
        $token = $request->get('token_ws');
        $transaction = new Transaction();
        $transaction->configureForIntegration(config('services.transbank.webpay_plus.commerce_code'), config('services.transbank.webpay_plus.api_key'));
        $response = $transaction->commit($token);

        if ($response->isApproved()) {
            $registrationData = $request->session()->get('registration_data');

            if ($registrationData) {
                $user = User::create([
                    'name' => $registrationData['name'],
                    'email' => $registrationData['email'],
                    'password' => Hash::make($registrationData['password']),
                    'plan_id' => $registrationData['plan_id'],
                ]);

                event(new Registered($user));

                Auth::login($user);

                $request->session()->forget('registration_data');

                return Inertia::render('PaymentSuccess', [
                    'message' => '¡Pago exitoso! Tu plan ha sido activado y tu cuenta creada.',
                    'response' => $response,
                ]);
            } else if ($upgradePlanData = $request->session()->get('upgrade_plan_data')) {
                $user = User::find($upgradePlanData['user_id']);
                if ($user) {
                    $user->plan_id = $upgradePlanData['new_plan_id'];
                    $user->save();
                    $request->session()->forget('upgrade_plan_data');
                    return Inertia::render('PaymentSuccess', [
                        'message' => '¡Pago exitoso! Tu plan ha sido actualizado.',
                        'response' => $response,
                    ]);
                }
            } else {
                // Handle case where no relevant session data is found
                return Inertia::render('PaymentFailure', [
                    'message' => 'El pago fue exitoso, pero no se pudo completar la operación. Por favor, contacta a soporte.',
                    'response' => $response,
                ]);
            }
        } else {
            // Payment failed
            return Inertia::render('PaymentFailure', [
                'message' => 'El pago ha fallado. Por favor, inténtalo de nuevo.',
                'response' => $response,
            ]);
        }
    }

    public function initiateOneclickInscription(Request $request)
    {
        $user = $request->user();
        $username = 'user-' . $user->id;
        $email = $user->email;
        $responseUrl = route('oneclick.return');

        $response = (new MallInscription)->start($username, $email, $responseUrl);

        return Inertia::location($response->getRedirectUrl() . '?token=' . $response->getToken());
    }

    public function returnFromOneclickInscription(Request $request)
    {
        $token = $request->get('token');
        $response = (new MallInscription)->finish($token);

        if ($response->isApproved()) {
            OneclickInscription::create([
                'user_id' => auth()->id(),
                'tbk_user' => $response->getTbkUser(),
                'card_type' => $response->getCardType(),
                'card_number' => $response->getCardNumber(),
            ]);

            return Inertia::render('PaymentSuccess', [
                'message' => '¡Tarjeta inscrita exitosamente para Oneclick!',
                'response' => $response,
            ]);
        } else {
            return Inertia::render('PaymentFailure', [
                'message' => 'La inscripción de la tarjeta ha fallado.',
                'response' => $response,
            ]);
        }
    }

    public function initiateOneclickPayment(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:plans,id',
            'tbk_user' => 'required|string',
        ]);

        $user = $request->user();
        $plan = Plan::findOrFail($request->plan_id);
        $amount = $plan->price;
        $buyOrder = 'order-' . uniqid();
        $tbkUser = $request->tbk_user;
        $childCommerceCode = config('transbank.oneclick_child_commerce_code'); // Define this in config/services.php
        $childBuyOrder = 'child-order-' . uniqid();

        try {
            $response = (new MallTransaction)->authorize(
                $tbkUser,
                $user->email, // Use user's email as username for Oneclick payment
                $buyOrder,
                $sessionId = 'session-' . uniqid(),
                [
                    [
                        'commerce_code' => $childCommerceCode,
                        'buy_order' => $childBuyOrder,
                        'amount' => $amount,
                        'installments_number' => 0 // 0 for single payment
                    ]
                ]
            );

            if ($response->isApproved()) {
                $user->plan_id = $plan->id;
                $user->save();

                return Inertia::render('PaymentSuccess', [
                    'message' => '¡Pago de plan con Oneclick exitoso!',
                    'response' => $response,
                ]);
            } else {
                return Inertia::render('PaymentFailure', [
                    'message' => 'El pago con Oneclick ha fallado.',
                    'response' => $response,
                ]);
            }
        } catch (\Exception $e) {
            return Inertia::render('PaymentFailure', [
                'message' => 'Error al procesar el pago con Oneclick: ' . $e->getMessage(),
                'response' => null,
            ]);
        }
    }

    public function deleteOneclickInscription(OneclickInscription $oneclickInscription)
    {
        // Ensure the user owns this inscription before deleting
        if ($oneclickInscription->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        try {
            // Optionally, you might want to call Transbank's unregister method here
            // MallInscription::delete($oneclickInscription->tbk_user, $oneclickInscription->card_number);

            $oneclickInscription->delete();

            return redirect()->route('profile.oneclick')->with('success', 'Inscripción Oneclick eliminada exitosamente.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Error al eliminar la inscripción Oneclick: ' . $e->getMessage()]);
        }
    }
}
