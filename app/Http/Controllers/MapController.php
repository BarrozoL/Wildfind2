<?php
namespace App\Http\Controllers;

use App\Models\Sighting;
use Illuminate\Http\Request;

class MapController extends Controller
{
    public function index(Request $request)
    {
        $data = $request->validate([
            'minLng'     => ['required','numeric','gte:-180','lte:180'],
            'minLat'     => ['required','numeric','gte:-90','lte:90'],
            'maxLng'     => ['required','numeric','gte:-180','lte:180'],
            'maxLat'     => ['required','numeric','gte:-90','lte:90'],
            'species_id' => ['nullable','integer','exists:species,id'],
            'from'       => ['nullable','date'],
            'to'         => ['nullable','date'],
            'limit'      => ['nullable','integer','min:100','max:5000'],
        ]);

        $limit = $data['limit'] ?? 3000;

        $items = Sighting::query()
            ->select(['id','species_id','lat','lng','observed_at'])
            ->verified()
            ->withinBbox($data['minLng'],$data['minLat'],$data['maxLng'],$data['maxLat'])
            ->withFilters($data['species_id'] ?? null, $data['from'] ?? null, $data['to'] ?? null)
            ->orderByDesc('observed_at')
            ->limit($limit)
            ->get();

        return response()->json(['items' => $items]);
    }
}
