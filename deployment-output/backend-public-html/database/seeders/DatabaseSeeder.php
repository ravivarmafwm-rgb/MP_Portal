<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // ── Step 1: Roles & reference data ───────────────────────────────────
        $this->call([
            RoleSeeder::class,
            DepartmentSeeder::class,
            GrievanceCategorySeeder::class,
            SchemeSeeder::class,
        ]);

        // ── Step 2: Geographic structure ─────────────────────────────────────
        $this->call([
            ConstituencySeeder::class,
        ]);

        // ── Step 3: Default users ─────────────────────────────────────────────
        $this->createDefaultUsers();

        // ── Step 4: Dashboard operational data ───────────────────────────────
        $this->call([
            DashboardDataSeeder::class,
            MeetingSeeder::class,
        ]);
    }

    private function createDefaultUsers(): void
    {
        $userList = [
            ['name' => 'Super Admin',          'email' => 'admin@mpdashboard.com',     'password' => 'Admin@1234',     'role' => 'super-admin'],
            ['name' => 'Hon. Ravi Varma',       'email' => 'mp@mpdashboard.com',        'password' => 'MP@1234',        'role' => 'mp'],
            ['name' => 'K. Narasimha Reddy',    'email' => 'mla@mpdashboard.com',       'password' => 'MLA@1234',       'role' => 'mla'],
            ['name' => 'Office Staff',          'email' => 'staff@mpdashboard.com',     'password' => 'Staff@1234',     'role' => 'mp-staff'],
            ['name' => 'Pradeep Coordinator',   'email' => 'coord@mpdashboard.com',     'password' => 'Coord@1234',     'role' => 'constituency-coordinator'],
            ['name' => 'Test Volunteer',        'email' => 'volunteer@mpdashboard.com', 'password' => 'Volunteer@1234', 'role' => 'volunteer'],
            ['name' => 'Dept Officer',          'email' => 'officer@mpdashboard.com',   'password' => 'Officer@1234',   'role' => 'government-officer'],
            ['name' => 'Test Citizen',          'email' => 'citizen@mpdashboard.com',   'password' => 'Citizen@1234',   'role' => 'citizen'],
        ];

        foreach ($userList as $userData) {
            $role = Role::where('slug', $userData['role'])->first();
            User::updateOrCreate(
                ['email' => $userData['email']],
                [
                    'name'     => $userData['name'],
                    'password' => bcrypt($userData['password']),
                    'role_id'  => $role?->id,
                ]
            );
        }
    }
}
