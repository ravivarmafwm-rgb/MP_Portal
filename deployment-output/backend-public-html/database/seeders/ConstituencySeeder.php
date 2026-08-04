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
        // ── MP Constituency – Andhra Pradesh ───────────────────────────────────
        $constituency = Constituency::firstOrCreate(
            ['code' => 'AP-TIRUPATI-01'],
            [
                'name'         => 'Tirupati Lok Sabha Constituency',
                'state'        => 'Andhra Pradesh',
                'district'     => 'Tirupati',
                'total_voters' => 1650000,
                'mp_name'      => 'Hon. Gurumurthy Madhu',
                'mp_party'     => 'TDP',
                'latitude'     => 13.6288,
                'longitude'    => 79.4192,
                'is_active'    => true,
            ]
        );

        // ── Assembly Constituencies ────────────────────────────────────────────
        $assemblyData = [
            ['name' => 'Tirupati',          'code' => 'AP-AC-001', 'mla_name' => 'Bhumana Karunakar Reddy', 'total_voters' => 295000],
            ['name' => 'Srikalahasti',      'code' => 'AP-AC-002', 'mla_name' => 'Bojjala Sudhakar Reddy', 'total_voters' => 270000],
            ['name' => 'Satyavedu',         'code' => 'AP-AC-003', 'mla_name' => 'Veeraiah Chowdary',      'total_voters' => 255000],
            ['name' => 'Nagari',            'code' => 'AP-AC-004', 'mla_name' => 'Ramprasad Reddy',        'total_voters' => 285000],
            ['name' => 'Chandragiri',       'code' => 'AP-AC-005', 'mla_name' => 'Chevireddy Bhaskar',     'total_voters' => 310000],
            ['name' => 'Gangadharnellore',  'code' => 'AP-AC-006', 'mla_name' => 'Venkatramaiah',          'total_voters' => 235000],
            ['name' => 'Puttur',            'code' => 'AP-AC-007', 'mla_name' => 'Suresh Babu',            'total_voters' => 198000],
        ];

        foreach ($assemblyData as $acData) {
            $ac = AssemblyConstituency::firstOrCreate(
                ['code' => $acData['code']],
                [
                    'name'            => $acData['name'],
                    'constituency_id' => $constituency->id,
                    'mla_name'        => $acData['mla_name'],
                    'total_voters'    => $acData['total_voters'],
                    'is_active'       => true,
                ]
            );

            foreach ($this->getMandalsFor($acData['name']) as $mandalData) {
                $mandal = Mandal::firstOrCreate(
                    ['code' => $mandalData['code']],
                    [
                        'name'                     => $mandalData['name'],
                        'assembly_constituency_id' => $ac->id,
                        'total_villages'           => count($mandalData['villages']),
                        'is_active'                => true,
                    ]
                );

                foreach ($mandalData['villages'] as $villageName) {
                    $code = strtoupper(substr(preg_replace('/[^A-Za-z]/', '', $villageName), 0, 4))
                          . strtoupper(Str::random(4));

                    $village = Village::firstOrCreate(
                        ['name' => $villageName, 'mandal_id' => $mandal->id],
                        [
                            'code'         => $code,
                            'population'   => rand(2000, 12000),
                            'households'   => rand(400, 2500),
                            'total_voters' => rand(900, 5000),
                            'is_active'    => true,
                        ]
                    );

                    $wardCount = rand(2, 5);
                    for ($w = 1; $w <= $wardCount; $w++) {
                        $ward = Ward::firstOrCreate(
                            ['village_id' => $village->id, 'ward_number' => $w],
                            [
                                'name'         => $villageName . ' Ward ' . $w,
                                'code'         => 'WD' . strtoupper(Str::random(8)),
                                'population'   => (int) round($village->population   / $wardCount),
                                'households'   => (int) round($village->households   / $wardCount),
                                'total_voters' => (int) round($village->total_voters / $wardCount),
                                'is_active'    => true,
                            ]
                        );

                        PollingBooth::firstOrCreate(
                            ['ward_id' => $ward->id, 'booth_number' => $w],
                            [
                                'name'         => $villageName . ' Polling Booth ' . $w,
                                'code'         => 'PB' . strtoupper(Str::random(8)),
                                'total_voters' => $ward->total_voters,
                                'is_active'    => true,
                            ]
                        );
                    }
                }
            }
        }
    }

    // ── Andhra Pradesh – real mandal/village data ─────────────────────────────
    private function getMandalsFor(string $acName): array
    {
        return match ($acName) {
            'Tirupati' => [
                ['name' => 'Tirupati Urban',  'code' => 'AP-MD-101', 'villages' => ['Tirupati Municipality', 'Korlagunta', 'Tilak Nagar', 'Vinayaka Nagar', 'Avilala']],
                ['name' => 'Tirupati Rural',  'code' => 'AP-MD-102', 'villages' => ['Settipalle', 'Karakambadi', 'Thattiparthi', 'Vadamalapeta', 'Perur']],
            ],
            'Srikalahasti' => [
                ['name' => 'Srikalahasti',    'code' => 'AP-MD-103', 'villages' => ['Srikalahasti Town', 'Puthalapattu', 'Gudimallam', 'Punganur Road', 'Yerpedu']],
                ['name' => 'Nagalapuram',     'code' => 'AP-MD-104', 'villages' => ['Nagalapuram', 'Sullurpeta', 'Naidupeta', 'Ozili', 'Muttukur']],
            ],
            'Satyavedu' => [
                ['name' => 'Satyavedu',       'code' => 'AP-MD-105', 'villages' => ['Satyavedu', 'Tada', 'Naidupeta', 'Venkatachalam', 'Kota']],
                ['name' => 'Naidupeta',       'code' => 'AP-MD-106', 'villages' => ['Naidupeta Town', 'Buchireddipalem', 'Atmakur', 'Bogole', 'Vinjamur']],
            ],
            'Nagari' => [
                ['name' => 'Nagari',          'code' => 'AP-MD-107', 'villages' => ['Nagari Town', 'Pakala', 'Pulicherla', 'Puttur Road', 'Irala']],
                ['name' => 'Pakala',          'code' => 'AP-MD-108', 'villages' => ['Pakala', 'Chittoor Road', 'Madanapalle', 'Palamaner', 'Bangarupalem']],
            ],
            'Chandragiri' => [
                ['name' => 'Chandragiri',     'code' => 'AP-MD-109', 'villages' => ['Chandragiri Town', 'Renigunta', 'Balaji Colony', 'Alipiri', 'Kapila Theertham']],
                ['name' => 'Renigunta',       'code' => 'AP-MD-110', 'villages' => ['Renigunta', 'Karakambadi Road', 'Settipalle', 'Thummalur', 'Krishnapuram']],
            ],
            'Gangadharnellore' => [
                ['name' => 'Gangadharnellore','code' => 'AP-MD-111', 'villages' => ['Gangadharnellore', 'Kuppam', 'Gudupalle', 'Vayalpad', 'Sodam']],
            ],
            'Puttur' => [
                ['name' => 'Puttur',          'code' => 'AP-MD-112', 'villages' => ['Puttur Town', 'Vedurukuppam', 'Rapur', 'Piler', 'Pileru']],
            ],
            default => [
                ['name' => $acName . ' Central', 'code' => 'AP-MD-' . rand(200, 299), 'villages' => ['Village 1', 'Village 2', 'Village 3']],
            ],
        };
    }
}
