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


    $items = \DB::table('sightings')
        ->leftJoin('species', 'species.id', '=', 'sightings.species_id')
        ->select(
            'sightings.id','sightings.species_id','sightings.lat','sightings.lng','sightings.observed_at',
            'species.common_name','species.scientific_name'
            )
        ->where('status','verified')
        ->whereBetween('lat', [$data['minLat'], $data['maxLat']])
        ->whereBetween('lng', [$data['minLng'], $data['maxLng']])
        ->when(!empty($data['species_id']), fn($q)=>$q->where('species_id',$data['species_id']))
        ->when(!empty($data['from']) && !empty($data['to']), fn($q)=>$q->whereBetween('observed_at', [$data['from'],$data['to']]))
        ->orderByDesc('observed_at')
        ->limit($limit)
        ->get();
        
        return response()->json(['items'=>$items]);


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
