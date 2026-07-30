<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $matrix = [
            'dashboard.view' => ['mp', 'mp-staff', 'constituency-coordinator', 'mla', 'volunteer'],
            'citizens.view' => ['mp', 'mp-staff', 'constituency-coordinator', 'assembly-coordinator', 'mandal-coordinator', 'village-coordinator', 'volunteer'],
            'citizens.create' => ['mp-staff', 'constituency-coordinator', 'assembly-coordinator', 'mandal-coordinator', 'village-coordinator', 'volunteer'],
            'citizens.update' => ['mp-staff', 'constituency-coordinator', 'assembly-coordinator', 'mandal-coordinator', 'village-coordinator'],
            'families.manage' => ['mp-staff', 'constituency-coordinator', 'assembly-coordinator', 'mandal-coordinator', 'village-coordinator', 'volunteer'],
            'grievances.view' => ['mp', 'mp-staff', 'constituency-coordinator', 'assembly-coordinator', 'mandal-coordinator', 'village-coordinator', 'volunteer', 'government-officer'],
            'grievances.create' => ['mp-staff', 'constituency-coordinator', 'assembly-coordinator', 'mandal-coordinator', 'village-coordinator', 'volunteer'],
            'grievances.update' => ['mp-staff', 'constituency-coordinator', 'government-officer'],
            'projects.view' => ['mp', 'mla', 'mp-staff', 'constituency-coordinator', 'government-officer'],
            'projects.manage' => ['mp-staff', 'constituency-coordinator'],
            'schemes.view' => ['mp', 'mp-staff', 'constituency-coordinator', 'volunteer'],
            'schemes.manage' => ['mp-staff', 'constituency-coordinator'],
            'surveys.view' => ['mp', 'mla', 'mp-staff', 'constituency-coordinator', 'assembly-coordinator', 'mandal-coordinator', 'village-coordinator', 'volunteer'],
            'surveys.manage' => ['mp-staff', 'constituency-coordinator'],
            'surveys.submit' => ['mp-staff', 'constituency-coordinator', 'assembly-coordinator', 'mandal-coordinator', 'village-coordinator', 'volunteer'],
            'volunteers.view' => ['mp', 'mla', 'mp-staff', 'constituency-coordinator', 'assembly-coordinator', 'mandal-coordinator', 'village-coordinator'],
            'volunteers.manage' => ['mp-staff', 'constituency-coordinator'],
            'meetings.view' => ['mp', 'mp-staff', 'constituency-coordinator'],
            'meetings.manage' => ['mp-staff', 'constituency-coordinator'],
            'documents.view' => ['mp', 'mp-staff', 'constituency-coordinator', 'government-officer'],
            'documents.manage' => ['mp-staff', 'constituency-coordinator'],
            'locations.view' => ['mp', 'mla', 'mp-staff', 'constituency-coordinator', 'assembly-coordinator', 'mandal-coordinator', 'village-coordinator', 'volunteer', 'government-officer'],
            'analytics.view' => ['mp', 'mla', 'mp-staff', 'constituency-coordinator', 'assembly-coordinator', 'mandal-coordinator', 'village-coordinator'],
            'communications.view' => ['mp', 'mp-staff', 'constituency-coordinator'],
            'communications.manage' => ['mp-staff', 'constituency-coordinator'],
            'communications.approve' => ['mp', 'mp-staff'],
        ];

        foreach ($matrix as $slug => $roles) {
            [$module, $action] = explode('.', $slug, 2);
            $permission = Permission::updateOrCreate(['slug' => $slug], ['name' => ucfirst($module).' '.ucfirst($action), 'module' => $module]);
            $permission->roles()->sync(Role::whereIn('slug', $roles)->pluck('id'));
        }
    }
}
