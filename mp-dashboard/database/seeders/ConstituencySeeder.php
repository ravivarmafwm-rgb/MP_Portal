<?php

namespace Database\Seeders;

use App\Models\AssemblyConstituency;
use App\Models\Constituency;
use App\Models\Mandal;
use App\Models\Village;
use App\Models\Ward;
use App\Models\PollingBooth;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ConstituencySeeder extends Seeder
{
    public function run(): void
    {
        // ── MP Constituency ────────────────────────────────────────────────────
        $constituency = Constituency::create([
            'name'         => 'Madhapur Lok Sabha',
            'code'         => 'MH-17',
            'state'        => 'Telangana',
            'district'     => 'Hyderabad',
            'total_voters' => 2489300,
            'mp_name'      => 'Hon. Ravi Varma',
            'mp_party'     => 'TRS',
            'latitude'     => 17.4400,
            'longitude'    => 78.3940,
            'is_active'    => true,
        ]);

        // ── Assembly Constituencies ────────────────────────────────────────────
        $assemblyData = [
            ['name' => 'Madhapur', 'code' => 'AC-01', 'mla_name' => 'K. Narasimha Reddy', 'total_voters' => 420000],
            ['name' => 'Kondapur', 'code' => 'AC-02', 'mla_name' => 'P. Lakshmi Devi',    'total_voters' => 385000],
            ['name' => 'Gachibowli', 'code' => 'AC-03', 'mla_name' => 'S. Ravi Kumar',    'total_voters' => 410000],
            ['name' => 'Kukatpally', 'code' => 'AC-04', 'mla_name' => 'A. Venkat Rao',    'total_voters' => 460000],
            ['name' => 'Serilingampally', 'code' => 'AC-05', 'mla_name' => 'M. Suresh',   'total_voters' => 395000],
        ];

        foreach ($assemblyData as $acData) {
            $ac = AssemblyConstituency::create([
                'name'             => $acData['name'],
                'code'             => $acData['code'],
                'constituency_id'  => $constituency->id,
                'mla_name'         => $acData['mla_name'],
                'total_voters'     => $acData['total_voters'],
                'is_active'        => true,
            ]);

            // ── Mandals per Assembly Constituency ──────────────────────────────
            $mandals = $this->getMandalsFor($acData['name']);
            foreach ($mandals as $mandalData) {
                $mandal = Mandal::create([
                    'name'                      => $mandalData['name'],
                    'code'                      => $mandalData['code'],
                    'assembly_constituency_id'  => $ac->id,
                    'total_villages'            => count($mandalData['villages']),
                    'is_active'                 => true,
                ]);

                // ── Villages per Mandal ────────────────────────────────────────
                foreach ($mandalData['villages'] as $villageName) {
                    $village = Village::create([
                        'name'        => $villageName,
                        'code'        => strtoupper(substr(preg_replace('/[^A-Za-z]/', '', $villageName), 0, 3))
                                         . strtoupper(Str::random(5)),
                        'mandal_id'   => $mandal->id,
                        'population'  => rand(1500, 8000),
                        'households'  => rand(300, 1800),
                        'total_voters'=> rand(800, 3500),
                        'is_active'   => true,
                    ]);

                    // ── Wards per Village (2–4) ────────────────────────────────
                    $wardCount = rand(2, 4);
                    for ($w = 1; $w <= $wardCount; $w++) {
                        $ward = Ward::create([
                            'name'        => $villageName . ' Ward ' . $w,
                            'code'        => 'WD' . strtoupper(Str::random(8)),
                            'village_id'  => $village->id,
                            'ward_number' => $w,
                            'population'  => (int) round($village->population / $wardCount),
                            'households'  => (int) round($village->households / $wardCount),
                            'total_voters'=> (int) round($village->total_voters / $wardCount),
                            'is_active'   => true,
                        ]);

                        // ── 1 Polling Booth per Ward ───────────────────────────
                        PollingBooth::create([
                            'name'          => $villageName . ' Booth ' . $w,
                            'code'          => 'PB' . strtoupper(Str::random(8)),
                            'ward_id'       => $ward->id,
                            'booth_number'  => $w,
                            'total_voters'  => $ward->total_voters,
                            'is_active'     => true,
                        ]);
                    }
                }
            }
        }
    }

    private function getMandalsFor(string $acName): array
    {
        return match ($acName) {
            'Madhapur' => [
                ['name' => 'Madhapur',    'code' => 'MD-01', 'villages' => ['Hafeezpet', 'Ayyappa Society', 'KPHB Phase 1', 'Madhapur Village', 'Raidurgam']],
            ],
            'Kondapur' => [
                ['name' => 'Kondapur',    'code' => 'MD-02', 'villages' => ['Kondapur Village', 'Telecom Nagar', 'Nallagandla', 'Gopanpally', 'Manikonda']],
            ],
            'Gachibowli' => [
                ['name' => 'Gachibowli', 'code' => 'MD-03', 'villages' => ['Gachibowli Village', 'Financial District', 'Nanakramguda', 'Khajaguda', 'Puppalaguda']],
            ],
            'Kukatpally' => [
                ['name' => 'Kukatpally', 'code' => 'MD-04', 'villages' => ['KPHB Colony', 'Kukatpally Village', 'JNTU Area', 'Pragathi Nagar', 'Bachupally', 'Nizampet']],
            ],
            'Serilingampally' => [
                ['name' => 'Serilingampally', 'code' => 'MD-05', 'villages' => ['Serilingampally', 'Miyapur', 'Chandanagar', 'Lingampally', 'Tellapur']],
            ],
            default => [
                ['name' => $acName . ' Central', 'code' => 'MD-' . rand(10, 99), 'villages' => ['Sector 1', 'Sector 2', 'Sector 3']],
            ],
        };
    }
}
