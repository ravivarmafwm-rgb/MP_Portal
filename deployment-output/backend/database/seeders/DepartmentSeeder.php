<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        $departments = [
            [
                'name' => 'Revenue',
                'code' => 'REV',
                'description' => 'Revenue and land records department',
                'is_active' => true,
            ],
            [
                'name' => 'Health',
                'code' => 'HLT',
                'description' => 'Health and medical services department',
                'is_active' => true,
            ],
            [
                'name' => 'Education',
                'code' => 'EDU',
                'description' => 'Education and literacy department',
                'is_active' => true,
            ],
            [
                'name' => 'Agriculture',
                'code' => 'AGR',
                'description' => 'Agriculture and farming department',
                'is_active' => true,
            ],
            [
                'name' => 'Panchayat Raj',
                'code' => 'PR',
                'description' => 'Panchayat Raj and rural development department',
                'is_active' => true,
            ],
            [
                'name' => 'Rural Development',
                'code' => 'RD',
                'description' => 'Rural development department',
                'is_active' => true,
            ],
            [
                'name' => 'Railways',
                'code' => 'RW',
                'description' => 'Railway department',
                'is_active' => true,
            ],
            [
                'name' => 'Passport Office',
                'code' => 'PPO',
                'description' => 'Passport and immigration services',
                'is_active' => true,
            ],
        ];

        foreach ($departments as $department) {
            Department::create($department);
        }
    }
}
