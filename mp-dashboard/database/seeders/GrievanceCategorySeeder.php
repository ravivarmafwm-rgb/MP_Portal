<?php

namespace Database\Seeders;

use App\Models\GrievanceCategory;
use Illuminate\Database\Seeder;

class GrievanceCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Roads',
                'slug' => 'roads',
                'description' => 'Road construction, maintenance, and related issues',
                'sla_days' => 14,
                'severity' => 'high',
                'is_active' => true,
            ],
            [
                'name' => 'Water',
                'slug' => 'water',
                'description' => 'Drinking water supply and water infrastructure issues',
                'sla_days' => 7,
                'severity' => 'high',
                'is_active' => true,
            ],
            [
                'name' => 'Drainage',
                'slug' => 'drainage',
                'description' => 'Drainage and sewage related issues',
                'sla_days' => 10,
                'severity' => 'medium',
                'is_active' => true,
            ],
            [
                'name' => 'Health',
                'slug' => 'health',
                'description' => 'Healthcare services and medical facility issues',
                'sla_days' => 7,
                'severity' => 'high',
                'is_active' => true,
            ],
            [
                'name' => 'Education',
                'slug' => 'education',
                'description' => 'Education and school related issues',
                'sla_days' => 14,
                'severity' => 'medium',
                'is_active' => true,
            ],
            [
                'name' => 'Welfare',
                'slug' => 'welfare',
                'description' => 'Social welfare and pension related issues',
                'sla_days' => 21,
                'severity' => 'medium',
                'is_active' => true,
            ],
            [
                'name' => 'Agriculture',
                'slug' => 'agriculture',
                'description' => 'Agriculture and farming support issues',
                'sla_days' => 14,
                'severity' => 'medium',
                'is_active' => true,
            ],
            [
                'name' => 'Electricity',
                'slug' => 'electricity',
                'description' => 'Power supply and electricity related issues',
                'sla_days' => 5,
                'severity' => 'high',
                'is_active' => true,
            ],
        ];

        foreach ($categories as $category) {
            GrievanceCategory::create($category);
        }
    }
}
