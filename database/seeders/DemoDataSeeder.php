<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\{User, Species, Sighting};
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        // Demo users
        for ($i=0; $i<3; $i++) {
            \App\Models\User::firstOrCreate(
                ['email' => "demo{$i}@wildfind.test"],
                ['name' => "Demo {$i}", 'password' => Hash::make('password')]
            );
        }

        $users   = \App\Models\User::all();
        $species = Species::all();

        // Portugal continental approx envelope
        $minLat = 36.95; $maxLat = 42.15; $minLng = -9.55; $maxLng = -6.19;

        // 300 sightings
        for ($i=0; $i<300; $i++) {
            $lat   = $faker->randomFloat(6, $minLat, $maxLat);
            $lng   = $faker->randomFloat(6, $minLng, $maxLng);
            $user  = $users->random();
            $sp    = $species->random();

            Sighting::create([
                'user_id'     => $user->id,
                'species_id'  => $sp->id,
                'lat'         => $lat,
                'lng'         => $lng,
                'observed_at' => now()->subDays(rand(0,120))->subMinutes(rand(0,600)),
                'status'      => rand(0,1) ? 'verified' : 'pending',
            ]);
        }
    }
}
