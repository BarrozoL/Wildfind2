<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Species;

class SpeciesSeeder extends Seeder
{
    public function run(): void
    {
        $rows = [
            ['scientific_name' => 'Larus michahellis', 'common_name' => 'Gaivota-de-patas-amarelas'],
            ['scientific_name' => 'Erithacus rubecula', 'common_name' => 'Pisco-de-peito-ruivo'],
            ['scientific_name' => 'Pinus pinaster', 'common_name' => 'Pinheiro-bravo'],
            ['scientific_name' => 'Ophrys fusca', 'common_name' => 'Abelha-das-orquídeas'],
        ];
        foreach ($rows as $r) {
            Species::firstOrCreate(['scientific_name' => $r['scientific_name']], $r);
        }
    }
}
