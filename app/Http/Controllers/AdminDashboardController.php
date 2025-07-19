<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\MensajePostumo;
use App\Models\DocumentoImportante;
use App\Models\ContactoConfianza;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $totalUsers = User::count();

        $usersByPlan = User::select('plans.name', \DB::raw('count(*) as total'))
            ->join('plans', 'users.plan_id', '=', 'plans.id')
            ->groupBy('plans.name')
            ->get();

        $totalMensajesPostumos = MensajePostumo::count();
        $totalDocumentosImportantes = DocumentoImportante::count();
        $totalContactosConfianza = ContactoConfianza::count();
        $totalPayments = Payment::count();

        return Inertia::render('Admin/Dashboard', [
            'totalUsers' => $totalUsers,
            'usersByPlan' => $usersByPlan,
            'totalMensajesPostumos' => $totalMensajesPostumos,
            'totalDocumentosImportantes' => $totalDocumentosImportantes,
            'totalContactosConfianza' => $totalContactosConfianza,
            'totalPayments' => $totalPayments,
        ]);
    }
}
