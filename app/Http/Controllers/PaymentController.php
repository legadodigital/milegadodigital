<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Payment;

class PaymentController extends Controller
{
    public function index(Request $request): Response
    {
        $payments = $request->user()->payments()->with('plan')->latest()->paginate(10);

        return Inertia::render('Payments/Index', [
            'payments' => $payments,
        ]);
    }
}
