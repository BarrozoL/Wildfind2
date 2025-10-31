<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SightingMedia extends Model
{
    protected $fillable = ['sighting_id','url','format','bytes','width','height','kind'];

    public function sighting(): BelongsTo
    {
        return $this->belongsTo(Sighting::class);
    }
}
