<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MensajePostumoController;
use App\Http\Controllers\Api\DocumentoImportanteController;
use App\Http\Controllers\Api\ContactoConfianzaController;
use App\Http\Controllers\Api\RecuerdoController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::apiResource('plans', \App\Http\Controllers\PlanController::class);

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::apiResource('mensajes-postumos', MensajePostumoController::class)->names('api.mensajes-postumos');

    Route::apiResource('documentos-importantes', DocumentoImportanteController::class)->names('api.documentos-importantes');
    Route::get('documentos-importantes/{documentoImportante}/download', [DocumentoImportanteController::class, 'download'])->name('api.documentos-importantes.download');

    Route::apiResource('contactos-confianza', ContactoConfianzaController::class)->names('api.contactos-confianza');

    Route::apiResource('recuerdos', RecuerdoController::class)->names('api.recuerdos');
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
