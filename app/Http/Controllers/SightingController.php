<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSightingRequest;
use App\Models\Sighting;
use App\Models\SightingMedia;
use App\Models\Species;
use App\Services\CloudinaryService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SightingController extends Controller
{
    public function create()
    {
        $species = Species::query()
            ->select('id','scientific_name','common_name')
            ->orderByRaw("COALESCE(NULLIF(common_name,''), scientific_name)")
            ->get();

        return Inertia::render('sightings/Create', [
            'species' => $species,
            'now'     => now()->format('Y-m-d\TH:i'), // datetime-local
        ]);
    }

    public function store(StoreSightingRequest $request, CloudinaryService $cloudinary)
    {
        $user = Auth::user();

        $s = Sighting::create([
            'user_id'     => $user->id,
            'species_id'  => $request->input('species_id') ?: null,
            'lat'         => (float) $request->input('lat'),
            'lng'         => (float) $request->input('lng'),
            'observed_at' => $request->date('observed_at'),
            'note'        => $request->input('note'),
            'status'      => 'pending', // admin irá verificar depois
        ]);

        if ($request->hasFile('photo')) {
            $res = $cloudinary->uploadSighting($request->file('photo'), $user->id);

            SightingMedia::create([
                'sighting_id' => $s->id,
                'url'         => $res['url'],
                'format'      => $res['format'],
                'bytes'       => $res['bytes'],
                'width'       => $res['width'],
                'height'      => $res['height'],
                'kind'        => 'preview',
            ]);
        }

        return redirect()->route('map')
            ->with('success', 'Avistamento criado! Aguarda verificação.');
    }
}
