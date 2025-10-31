<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSightingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // já protegemos as rotas com auth+verified
    }

    public function rules(): array
    {
        return [
            'photo'       => ['required','file','image','max:5120'], // 5MB
            'observed_at' => ['required','date'],
            'lat'         => ['required','numeric','gte:-90','lte:90'],
            'lng'         => ['required','numeric','gte:-180','lte:180'],
            'species_id'  => ['nullable','integer','exists:species,id'],
            'note'        => ['nullable','string','max:1000'],
        ];
    }
}
