<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SpeciesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rows = [
        ['scientific_name' => 'Larus michahellis', 'common_name' => 'Gaivota-de-patas-amarelas'],
        ['scientific_name' => 'Erithacus rubecula', 'common_name' => 'Pisco-de-peito-ruivo'],
        ['scientific_name' => 'Pinus pinaster', 'common_name' => 'Pinheiro-bravo'],
        ['scientific_name' => 'Ophrys fusca', 'common_name' => 'Abelha-das-orquídeas'],
    ];
    foreach ($rows as $r) {
        \App\Models\Species::firstOrCreate(['scientific_name' => $r['scientific_name']], $r);
    }
    }
}

$this->call([
    \Database\Seeders\SpeciesSeeder::class,
]);
