<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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

Route::get('/map', fn () => Inertia::render('map/MapPage'))->name('map');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
