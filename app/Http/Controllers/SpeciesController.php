<?php

namespace App\Http\Controllers;

use App\Models\Species;

class SpeciesController extends Controller
{
    public function index()
    {
        $items = Species::query()
            ->select('id','scientific_name','common_name')
            ->orderByRaw("COALESCE(NULLIF(common_name,''), scientific_name)")
            ->get();

        return response()->json(['items' => $items]);
    }
}
