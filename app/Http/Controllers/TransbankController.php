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

        $token = $request->get('token_ws');
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

        // If billingCycle is still null (e.g., if it's a direct return from Transbank without session data),
        // try to get it from the request or default to 'monthly'.
        if (is_null($billingCycle)) {
            $billingCycle = $request->input('billing_cycle', 'monthly');
        }

        // Ensure we have a user ID for the payment record
        if (!$userId && $response->isApproved() && $registrationData) {
            // If it's a new registration and payment is approved, the user will be created soon.
            // We'll need to update this payment record with the user_id after user creation.
            // For now, we can leave user_id as null or try to find the user by email if already created.
            // For simplicity, let's assume user is created right after this block for registration flow.
            // Or, we can pass the user_id from the session if it's an upgrade.
            // Let's refine this: if registrationData, user is created AFTER this, so we need to handle it there.
            // For now, we'll assume userId is available for upgrade or existing user payments.
            // For new registrations, we'll update the payment record after user creation.
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
                'transbank_response' => json_encode([
                    'vci' => $response->getVci(),
                    'status' => $response->getStatus(),
                    'response_code' => $response->getResponseCode(),
                    'amount' => $response->getAmount(),
                    'authorization_code' => $response->getAuthorizationCode(),
                    'payment_type_code' => $response->getPaymentTypeCode(),
                    'accounting_date' => $response->getAccountingDate(),
                    'installments_number' => $response->getInstallmentsNumber(),
                    'installments_amount' => $response->getInstallmentsAmount(),
                    'session_id' => $response->getSessionId(),
                    'buy_order' => $response->getBuyOrder(),
                    'card_number' => $response->getCardNumber(),
                    'card_detail' => $response->getCardDetail(),
                    'transaction_date' => $response->getTransactionDate(),
                    'balance' => $response->getBalance(),
                ]),
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
                // Existing user making a payment not related to upgrade/registration
                $paymentData['user_id'] = Auth::id();
                Payment::create($paymentData);

                return Inertia::render('PaymentSuccess', [
                    'message' => '¡Pago exitoso!',
                    'response' => $response,
                ]);
            } else {
                // Handle case where no relevant session data is found and user is not authenticated
                return Inertia::render('PaymentFailure', [
                    'message' => 'El pago fue exitoso, pero no se pudo completar la operación. Por favor, contacta a soporte.',
                    'response' => $response,
                ]);
            }
        } else {
            // Payment failed
            // Create a payment record for rejected payment
            Payment::create([
                'user_id' => $userId, // This might still be null if it was a new registration attempt
                'plan_id' => $planId,
                'billing_cycle' => $billingCycle,
                'amount' => $response->getAmount(),
                'buy_order' => $response->getBuyOrder(),
                'session_id' => $response->getSessionId(),
                'token_ws' => $token,
                'status' => 'rejected',
                'transbank_response' => json_encode([
                    'vci' => $response->getVci(),
                    'status' => $response->getStatus(),
                    'response_code' => $response->getResponseCode(),
                    'amount' => $response->getAmount(),
                    'authorization_code' => $response->getAuthorizationCode(),
                    'payment_type_code' => $response->getPaymentTypeCode(),
                    'accounting_date' => $response->getAccountingDate(),
                    'installments_number' => $response->getInstallmentsNumber(),
                    'installments_amount' => $response->getInstallmentsAmount(),
                    'session_id' => $response->getSessionId(),
                    'buy_order' => $response->getBuyOrder(),
                    'card_number' => $response->getCardNumber(),
                    'card_detail' => $response->getCardDetail(),
                    'transaction_date' => $response->getTransactionDate(),
                    'balance' => $response->getBalance(),
                ]),
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
