<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Sighting extends Model
{
    protected $fillable = ['user_id','species_id','lat','lng','observed_at','note','status','ai_suggestion'];

    protected $casts = [
        'observed_at' => 'datetime',
        'ai_suggestion' => 'array',
    ];

    public function user(): BelongsTo {return $this->belongsTo(User::class); }
    public function species(): BelongsTo {return $this->belongsTo(Species::class); }
    public function media(): HasMany { return $this->hasMany(SightingMedia::class); }
    public function comments(): HasMany { return $this->hasMany(Comment::class); }
    public function likes(): HasMany { return $this->hasMany(Like::class); }

    // Scopes for map/feed
    public function scopeVerified($q) { return $q->where('status','verified'); }
    public function scopeWithinBbox($q, float $minLng, float $minLat, float $maxLng, float $maxLat) {
        return $q->whereBetween('lat', [$minLat, $maxLat])
                 ->whereBetween('lng', [$minLng, $maxLng]);
    }
    public function scopeWithFilters($q, ?int $speciesId, ?string $fromIso, ?string $toIso) {
        if ($speciesId) $q->where('species_id', $speciesId);
        if ($fromIso && $toIso) $q->whereBetween('observed_at', [$fromIso, $toIso]);
        return $q;
    }
}
