<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Species extends Model
{
    protected $fillable = ['scientific_name','common_name','taxonomy','cover_url'];
    protected $casts = ['taxonomy' => 'array'];

    public function sightings(): HasMany
    {
        return $this->hasMany(Sighting::class);
    }
}
