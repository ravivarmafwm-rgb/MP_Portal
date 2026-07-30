<?php

namespace Database\Seeders;

use App\Models\Scheme;
use Illuminate\Database\Seeder;

class SchemeSeeder extends Seeder
{
    public function run(): void
    {
        $schemes = [
            [
                'name' => 'Pradhan Mantri Awas Yojana',
                'code' => 'PMAY',
                'category' => 'Housing',
                'description' => 'Housing for All scheme',
                'max_amount' => 250000,
                'funding_source' => 'Central Government',
                'start_date' => '2015-06-01',
                'is_active' => true,
                'sla_days' => 30,
            ],
            [
                'name' => 'Pradhan Mantri Kisan Samman Nidhi',
                'code' => 'PMKISAN',
                'category' => 'Agriculture',
                'description' => 'Income support for farmers',
                'max_amount' => 6000,
                'funding_source' => 'Central Government',
                'start_date' => '2019-02-01',
                'is_active' => true,
                'sla_days' => 15,
            ],
            [
                'name' => 'Ayushman Bharat',
                'code' => 'ABY',
                'category' => 'Health',
                'description' => 'Health insurance scheme',
                'max_amount' => 500000,
                'funding_source' => 'Central Government',
                'start_date' => '2018-09-23',
                'is_active' => true,
                'sla_days' => 21,
            ],
            [
                'name' => 'Sarva Shiksha Abhiyan',
                'code' => 'SSA',
                'category' => 'Education',
                'description' => 'Education for all scheme',
                'max_amount' => 50000,
                'funding_source' => 'Central & State Government',
                'start_date' => '2001-01-01',
                'is_active' => true,
                'sla_days' => 30,
            ],
            [
                'name' => 'National Pension Scheme',
                'code' => 'NPS',
                'category' => 'Pension',
                'description' => 'Pension scheme for unorganized sector',
                'max_amount' => 100000,
                'funding_source' => 'Central Government',
                'start_date' => '2019-05-22',
                'is_active' => true,
                'sla_days' => 45,
            ],
            [
                'name' => 'Mahatma Gandhi National Rural Employment Guarantee Act',
                'code' => 'MGNREGA',
                'category' => 'Employment',
                'description' => 'Employment guarantee scheme',
                'max_amount' => 200000,
                'funding_source' => 'Central & State Government',
                'start_date' => '2006-02-02',
                'is_active' => true,
                'sla_days' => 15,
            ],
        ];

        foreach ($schemes as $scheme) {
            Scheme::create($scheme);
        }
    }
}
