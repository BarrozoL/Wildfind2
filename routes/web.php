<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\SightingController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/health', function () {
    DB::select('select 1'); 
    return response()->json(['status' => 'ok']);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::middleware(['auth','verified'])->group(function () {
    Route::get('/sightings/create', [SightingController::class, 'create'])->name('sightings.create');
    Route::post('/sightings', [SightingController::class, 'store'])->name('sightings.store');
});

Route::get('/map', fn () => Inertia::render('map/MapPage'))->name('map');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

use App\Http\Controllers\Admin\VerifyController;

Route::middleware(['auth','verified','admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/pending', [VerifyController::class, 'index'])->name('pending');
    Route::post('/sightings/{sighting}/verify', [VerifyController::class, 'verify'])->name('sightings.verify');
    Route::delete('/sightings/{sighting}', [VerifyController::class, 'destroy'])->name('sightings.destroy'); // opcional
});
