<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Sighting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VerifyController extends Controller
{
    public function index(Request $request)
    {
        $items = Sighting::query()
            ->where('status', 'pending')
            ->with([
                'user:id,name,email',
                'species:id,scientific_name,common_name',
                'media' => fn($q) => $q->orderBy('id')->limit(1),
            ])
            ->orderByDesc('id')
            ->paginate(20)
            ->through(function ($s) {
                // mini transformação para thumb Cloudinary (sem public_id)
                $thumb = null;
                if ($s->media->first()?->url) {
                    $thumb = str_replace('/upload/', '/upload/w_320,c_fill,q_auto,f_auto/', $s->media->first()->url);
                }
                return [
                    'id' => $s->id,
                    'user' => $s->user?->only(['id','name','email']),
                    'species' => $s->species ? [
                        'id' => $s->species->id,
                        'name' => $s->species->common_name ?? $s->species->scientific_name,
                    ] : null,
                    'lat' => $s->lat,
                    'lng' => $s->lng,
                    'observed_at' => $s->observed_at?->toIso8601String(),
                    'note' => $s->note,
                    'thumb' => $thumb,
                ];
            });

        return Inertia::render('admin/PendingSightings', [
            'items' => $items,
        ]);
    }

public function verify(Request $request, Sighting $sighting)
{
    $sighting->update([
        'status'      => 'verified',
        'verified_at' => now(),
        'verified_by' => $request->user()->id,
    ]);

    return back()->with('success', "Avistamento #{$sighting->id} verificado.");
}


    
    // (Opcional) rejeitar/remover
    public function destroy(Request $request, Sighting $sighting)
    {
        $sighting->delete();
        return back()->with('success', "Avistamento #{$sighting->id} removido.");
    }
}
