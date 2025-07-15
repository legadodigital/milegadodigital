<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Transbank\Webpay\WebpayPlus\Transaction;
use Transbank\Webpay\Oneclick\MallInscription;
use Transbank\Webpay\Oneclick\MallTransaction;
use App\Models\Plan;
use App\Models\User;
use App\Models\OneclickInscription;
use App\Models\Payment; // Add this line
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
            'billing_cycle' => 'required|in:monthly,annually',
        ]);

        $plan = Plan::findOrFail($request->plan_id);
        $amount = $plan->price;

        if ($request->billing_cycle === 'annually') {
            $amount = ($amount * 12) * (1 - $plan->annual_discount_percentage / 100);
        }

        $buyOrder = 'order-' . uniqid();
        $sessionId = 'session-' . uniqid();
        $returnUrl = route('webpay.return');

        if (config('services.transbank.webpay_plus.environment') === 'PRODUCCION') {
            $tx = Transaction::buildForProduction(
                config('services.transbank.webpay_plus.api_key'),
                config('services.transbank.webpay_plus.commerce_code')
            );
        } else {
            $tx = Transaction::buildForIntegration(
                config('services.transbank.webpay_plus.api_key'),
                config('services.transbank.webpay_plus.commerce_code')
            );
        }

        $response = $tx->create($buyOrder, $sessionId, $amount, $returnUrl);

        return Inertia::location($response->getUrl() . '?token_ws=' . $response->getToken());
    }

    public function returnFromWebpay(Request $request)
    {
        if (config('services.transbank.webpay_plus.environment') === 'PRODUCCION') {
            $tx = Transaction::buildForProduction(
                config('services.transbank.webpay_plus.api_key'),
                config('services.transbank.webpay_plus.commerce_code')
            );
        } else {
            $tx = Transaction::buildForIntegration(
                config('services.transbank.webpay_plus.api_key'),
                config('services.transbank.webpay_plus.commerce_code')
            );
        }

        $token = $request->input('token_ws');
        $tbkToken = $request->input('TBK_TOKEN');
        $tbkOrdenCompra = $request->input('TBK_ORDEN_COMPRA');
        $tbkIdSesion = $request->input('TBK_ID_SESION');

        // Caso 1: Transacción anulada por el usuario. Transbank devuelve TBK_TOKEN.
        if (!is_null($tbkToken)) {
            $registrationData = $request->session()->get('registration_data');
            $upgradePlanData = $request->session()->get('upgrade_plan_data');

            $planId = null;
            $billingCycle = null;
            $amount = 0; // Default amount

            if ($registrationData) {
                $planId = $registrationData['plan_id'];
                $billingCycle = $registrationData['billing_cycle'];
            } else if ($upgradePlanData) {
                $planId = $upgradePlanData['new_plan_id'];
                $billingCycle = $upgradePlanData['billing_cycle'];
            }

            if ($planId) {
                $plan = Plan::find($planId);
                if ($plan) {
                    $amount = $plan->price;
                    if ($billingCycle === 'annually') {
                        $amount = ($amount * 12) * (1 - $plan->annual_discount_percentage / 100);
                    }
                }
            }

            Payment::create([
                'user_id' => Auth::id(),
                'plan_id' => $planId,
                'billing_cycle' => $billingCycle,
                'amount' => $amount,
                'buy_order' => $tbkOrdenCompra,
                'session_id' => $tbkIdSesion,
                'token_ws' => $tbkToken, // Guardar el token de la transacción anulada
                'status' => 'cancelled',
                'transbank_response' => json_encode($request->all()),
                'payment_method' => 'webpay',
                'transaction_date' => now(),
            ]);

            return Inertia::render('PaymentFailure', [
                'message' => 'La compra fue anulada por el usuario.',
                'response' => null,
            ]);
        }

        // Caso 2: Flujo normal, pero no se recibe el token_ws. Es un error.
        if (is_null($token)) {
            return Inertia::render('PaymentFailure', [
                'message' => 'Error en la transacción: No se recibió un token válido.',
                'response' => null,
            ]);
        }

        // Caso 3: Flujo normal, se procede a confirmar la transacción.
        $response = $tx->commit($token);

        $registrationData = $request->session()->get('registration_data');
        $upgradePlanData = $request->session()->get('upgrade_plan_data');

        $userId = null;
        $planId = null;
        $billingCycle = null;

        // Determine planId and billingCycle based on session data or request
        if ($registrationData) {
            $planId = $registrationData['plan_id'];
            $billingCycle = $registrationData['billing_cycle'];
        } else if ($upgradePlanData) {
            $userId = $upgradePlanData['user_id'];
            $planId = $upgradePlanData['new_plan_id'];
            $billingCycle = $upgradePlanData['billing_cycle'];
        } else if (Auth::check()) {
            $userId = Auth::id();
            $planId = $request->input('plan_id');
            $billingCycle = $request->input('billing_cycle', 'monthly'); // For existing users, get from request or default
        }

        if (is_null($billingCycle)) {
            $billingCycle = $request->input('billing_cycle', 'monthly');
        }

        if ($response->isApproved()) {
            $paymentData = [
                'plan_id' => $planId,
                'billing_cycle' => $billingCycle,
                'amount' => $response->getAmount(),
                'buy_order' => $response->getBuyOrder(),
                'session_id' => $response->getSessionId(),
                'token_ws' => $token,
                'status' => 'approved',
                'transbank_response' => json_encode($response->jsonSerialize()),
                'payment_method' => 'webpay',
                'card_number' => $response->getCardNumber(),
                'transaction_date' => now(),
            ];

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

                $paymentData['user_id'] = $user->id;
                Payment::create($paymentData);

                return Inertia::render('PaymentSuccess', [
                    'message' => '¡Pago exitoso! Tu plan ha sido activado y tu cuenta creada.',
                    'response' => $response,
                ]);
            } else if ($upgradePlanData) {
                $user = User::find($upgradePlanData['user_id']);
                if ($user) {
                    $user->plan_id = $upgradePlanData['new_plan_id'];
                    $user->save();
                    $request->session()->forget('upgrade_plan_data');

                    $paymentData['user_id'] = $user->id;
                    Payment::create($paymentData);

                    return Inertia::render('PaymentSuccess', [
                        'message' => '¡Pago exitoso! Tu plan ha sido actualizado.',
                        'response' => $response,
                    ]);
                }
            } else if (Auth::check()) {
                $paymentData['user_id'] = Auth::id();
                Payment::create($paymentData);

                return Inertia::render('PaymentSuccess', [
                    'message' => '¡Pago exitoso!',
                    'response' => $response,
                ]);
            } else {
                return Inertia::render('PaymentFailure', [
                    'message' => 'El pago fue exitoso, pero no se pudo completar la operación. Por favor, contacta a soporte.',
                    'response' => $response,
                ]);
            }
        } else {
            // Payment failed
            Payment::create([
                'user_id' => $userId,
                'plan_id' => $planId,
                'billing_cycle' => $billingCycle,
                'amount' => $response->getAmount(),
                'buy_order' => $response->getBuyOrder(),
                'session_id' => $response->getSessionId(),
                'token_ws' => $token,
                'status' => 'rejected',
                'transbank_response' => json_encode($response->jsonSerialize()),
                'payment_method' => 'webpay',
                'card_number' => $response->getCardNumber(),
                'transaction_date' => now(),
            ]);
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
            'billing_cycle' => 'required|in:monthly,annually', // Add billing_cycle validation
        ]);

        $user = $request->user();
        $plan = Plan::findOrFail($request->plan_id);
        $amount = $plan->price;

        // Apply annual discount if billing_cycle is annually
        if ($request->billing_cycle === 'annually') {
            $amount = ($amount * 12) * (1 - $plan->annual_discount_percentage / 100);
        }

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
                // Create a payment record for Oneclick payment
                Payment::create([
                    'user_id' => $user->id,
                    'plan_id' => $plan->id,
                    'billing_cycle' => $request->billing_cycle,
                    'amount' => $amount,
                    'buy_order' => $buyOrder,
                    'session_id' => $sessionId,
                    'token_ws' => null, // Not applicable for Oneclick payment
                    'status' => 'approved',
                    'transbank_response' => json_encode($response->jsonSerialize()),
                    'payment_method' => 'oneclick',
                    'card_number' => $response->getCardNumber(),
                    'transaction_date' => now(),
                ]);

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
