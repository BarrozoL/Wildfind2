<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MapController;
use App\Http\Controllers\SpeciesController;

Route::get('/map/sightings', [MapController::class, 'index'])->middleware('throttle:60,1');

Route::get('/species', [SpeciesController::class, 'index'])->middleware('throttle:60,1');
