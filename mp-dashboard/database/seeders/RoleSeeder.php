<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            ['name' => 'Super Admin',               'slug' => 'super-admin',              'description' => 'Full system access',                              'level' => 1],
            ['name' => 'MP',                         'slug' => 'mp',                       'description' => 'Member of Parliament',                            'level' => 2],
            ['name' => 'MLA',                        'slug' => 'mla',                      'description' => 'Member of Legislative Assembly',                  'level' => 3],
            ['name' => 'MP Staff',                   'slug' => 'mp-staff',                 'description' => 'MP Office Staff',                                 'level' => 4],
            ['name' => 'Constituency Coordinator',   'slug' => 'constituency-coordinator', 'description' => 'Manages full constituency operations',             'level' => 5],
            ['name' => 'Assembly Coordinator',       'slug' => 'assembly-coordinator',     'description' => 'Manages assembly constituency operations',         'level' => 6],
            ['name' => 'Mandal Coordinator',         'slug' => 'mandal-coordinator',       'description' => 'Manages mandal level operations',                 'level' => 7],
            ['name' => 'Village Coordinator',        'slug' => 'village-coordinator',      'description' => 'Manages village level operations',                'level' => 8],
            ['name' => 'Volunteer',                  'slug' => 'volunteer',                'description' => 'Field volunteer — citizen enrollment & surveys',   'level' => 9],
            ['name' => 'Government Officer',         'slug' => 'government-officer',       'description' => 'Department processing officer',                   'level' => 10],
            ['name' => 'Citizen',                    'slug' => 'citizen',                  'description' => 'Self-service citizen portal access',              'level' => 11],
            // Legacy alias kept for compatibility
            ['name' => 'Staff',                      'slug' => 'staff',                    'description' => 'General staff access alias',                      'level' => 4],
        ];

        foreach ($roles as $role) {
            Role::updateOrCreate(['slug' => $role['slug']], array_merge($role, ['is_active' => true]));
        }
    }
}
