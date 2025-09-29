<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MapController;

Route::get('/map/sightings', [MapController::class, 'index'])->middleware('throttle:60,1');
