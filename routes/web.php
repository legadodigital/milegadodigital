<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\MensajePostumoController;
use App\Http\Controllers\DocumentoImportanteController;
use App\Http\Controllers\ContactoConfianzaController;
use App\Http\Controllers\RecuerdoController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Mail\TestMail;
use Illuminate\Support\Facades\Mail;

Route::get('/test-mail', function () {
    Mail::to('calvarle@gmail.com')->send(new TestMail());
    return 'Correo de prueba enviado.';
});

use App\Models\Plan;

Route::get('/', function () {
    $plans = Plan::with('features')->get();
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'plans' => $plans,
    ]);
});

use App\Models\MensajePostumo;
use App\Models\DocumentoImportante;
use App\Models\Recuerdo;
use Illuminate\Support\Facades\Auth;

Route::get('/dashboard', function () {
    $user = Auth::user();
    $mensajesPendientes = MensajePostumo::where('user_id', $user->id)->where('estado', 'pendiente')->count();
    $ultimosDocumentos = DocumentoImportante::where('user_id', $user->id)->latest()->take(3)->get();
    $ultimosRecuerdos = Recuerdo::where('user_id', $user->id)->latest()->take(3)->get();
    $planFeatures = $user->plan->features->pluck('value', 'feature_code')->toArray();

    return Inertia::render('Dashboard', [
        'mensajesPendientes' => $mensajesPendientes,
        'ultimosDocumentos' => $ultimosDocumentos,
        'ultimosRecuerdos' => $ultimosRecuerdos,
        'planFeatures' => $planFeatures,
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Rutas para actualizar el plan del usuario
    Route::patch('/profile/plan', [ProfileController::class, 'updatePlan'])->name('profile.updatePlan');

    // Rutas para Configuración de Seguridad
    Route::get('/seguridad', [ProfileController::class, 'security'])->name('profile.security');
    Route::patch('/seguridad', [ProfileController::class, 'updateSecurity'])->name('profile.updateSecurity');

    // Rutas para Mensajes Póstumos
    Route::get('/mensajes-postumos', [MensajePostumoController::class, 'index'])->name('mensajes-postumos.index');
    Route::get('/mensajes-postumos/crear', [MensajePostumoController::class, 'create'])->name('mensajes-postumos.create');
    Route::post('/mensajes-postumos', [MensajePostumoController::class, 'store'])->name('mensajes-postumos.store');
    Route::get('/mensajes-postumos/{mensajePostumo}/editar', [MensajePostumoController::class, 'edit'])->name('mensajes-postumos.edit');
    Route::put('/mensajes-postumos/{mensajePostumo}', [MensajePostumoController::class, 'update'])->name('mensajes-postumos.update');
    Route::delete('/mensajes-postumos/{mensajePostumo}', [MensajePostumoController::class, 'destroy'])->name('mensajes-postumos.destroy');

    // Rutas para Documentos Importantes
    Route::get('/documentos-importantes', [DocumentoImportanteController::class, 'index'])->name('documentos-importantes.index');
    Route::get('/documentos-importantes/crear', [DocumentoImportanteController::class, 'create'])->name('documentos-importantes.create');
    Route::post('/documentos-importantes', [DocumentoImportanteController::class, 'store'])->name('documentos-importantes.store');
    Route::get('/documentos-importantes/{documentoImportante}/editar', [DocumentoImportanteController::class, 'edit'])->name('documentos-importantes.edit');
    Route::put('/documentos-importantes/{documentoImportante}', [DocumentoImportanteController::class, 'update'])->name('documentos-importantes.update');
    Route::delete('/documentos-importantes/{documentoImportante}', [DocumentoImportanteController::class, 'destroy'])->name('documentos-importantes.destroy');
    Route::get('/documentos-importantes/{documentoImportante}/descargar', [DocumentoImportanteController::class, 'download'])->name('documentos-importantes.download');

    // Rutas para Contactos de Confianza
    Route::get('/contactos-confianza', [ContactoConfianzaController::class, 'index'])->name('contactos-confianza.index');
    Route::get('/contactos-confianza/crear', [ContactoConfianzaController::class, 'create'])->name('contactos-confianza.create');
    Route::post('/contactos-confianza', [ContactoConfianzaController::class, 'store'])->name('contactos-confianza.store');
    Route::get('/contactos-confianza/{contactoConfianza}/editar', [ContactoConfianzaController::class, 'edit'])->name('contactos-confianza.edit');
    Route::put('/contactos-confianza/{contactoConfianza}', [ContactoConfianzaController::class, 'update'])->name('contactos-confianza.update');
    Route::delete('/contactos-confianza/{contactoConfianza}', [ContactoConfianzaController::class, 'destroy'])->name('contactos-confianza.destroy');

    // Rutas para Recuerdos
    Route::get('/recuerdos', [RecuerdoController::class, 'index'])->name('recuerdos.index');
    Route::get('/recuerdos/crear', [RecuerdoController::class, 'create'])->name('recuerdos.create');
    Route::post('/recuerdos', [RecuerdoController::class, 'store'])->name('recuerdos.store');
    Route::get('/recuerdos/{recuerdo}/editar', [RecuerdoController::class, 'edit'])->name('recuerdos.edit');
    Route::put('/recuerdos/{recuerdo}', [RecuerdoController::class, 'update'])->name('recuerdos.update');
    Route::delete('/recuerdos/{recuerdo}', [RecuerdoController::class, 'destroy'])->name('recuerdos.destroy');

    // Ruta para Grabar Video
    Route::get('/grabar-video', function () {
        $user = auth()->user();
        $canRecordVideo = false;
        $videoDurationLimit = 0;

        if ($user->is_admin) {
            $canRecordVideo = true;
            $videoDurationLimit = 999999; // Effectively unlimited for admin
        } else {
            $plan = $user->plan->load('features');
            $canRecordVideo = $plan->features->where('feature_code', 'video_recording')->first()->value === 'true';
            $videoDurationLimit = $plan->features->where('feature_code', 'video_duration')->first()->value ?? 0;
        }

        return Inertia::render('VideoRecorder', [
            'canRecordVideo' => $canRecordVideo,
            'videoDurationLimit' => (int)$videoDurationLimit,
        ]);
    })->name('video.recorder');
});

require __DIR__.'/auth.php';

Route::middleware(['auth', 'verified', \App\Http\Middleware\AdminMiddleware::class])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('dashboard');

    Route::get('/plans', function () {
        $plans = \App\Models\Plan::with('features')->get();
        return Inertia::render('Admin/Plans/Index', [
            'plans' => $plans,
        ]);
    })->name('plans.index');

    Route::get('/plans/create', function () {
        return Inertia::render('Admin/Plans/Create');
    })->name('plans.create');

    Route::post('/plans', [\App\Http\Controllers\PlanController::class, 'store'])->name('plans.store');

    Route::get('/plans/{plan}/edit', function (\App\Models\Plan $plan) {
        $plan->load('features');
        return Inertia::render('Admin/Plans/Edit', [
            'plan' => $plan,
        ]);
    })->name('plans.edit');

    Route::put('/plans/{plan}', [\App\Http\Controllers\PlanController::class, 'update'])->name('plans.update');

    Route::delete('/plans/{plan}', [\App\Http\Controllers\PlanController::class, 'destroy'])->name('plans.destroy');
});

