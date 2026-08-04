<?php

namespace Tests\Feature\Auth;

use App\Models\AssemblyConstituency;
use App\Models\Citizen;
use App\Models\Constituency;
use App\Models\Mandal;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use App\Models\Village;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class RoleGeographicAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_scoped_staff_can_only_view_citizens_in_assigned_village(): void
    {
        [$assigned, $outside] = $this->villages();
        $inside = $this->citizenAt($assigned, 'Inside');
        $outsideCitizen = $this->citizenAt($outside, 'Outside');
        $user = $this->userWithPermission('village-coordinator', 'citizens.view', ['village_id' => $assigned->id]);

        Sanctum::actingAs($user);

        $this->getJson('/api/citizens/'.$inside->id)->assertOk();
        $this->getJson('/api/citizens/'.$outsideCitizen->id)->assertForbidden();
        $this->getJson('/api/citizens')->assertOk()->assertJsonPath('meta.total', 1);
    }

    public function test_scoped_create_rejects_a_citizen_location_outside_assigned_village(): void
    {
        [$assigned, $outside] = $this->villages();
        $user = $this->userWithPermission('village-coordinator', 'citizens.create', ['village_id' => $assigned->id]);

        Sanctum::actingAs($user);

        $this->postJson('/api/citizens', [
            'first_name' => 'Outside',
            'last_name' => 'Scope',
            'date_of_birth' => '1990-01-01',
            'gender' => 'Female',
            'is_voter' => false,
            'village_id' => $outside->id,
            'pincode' => '500001',
            'district' => 'Test',
            'state' => 'Andhra Pradesh',
        ])->assertForbidden();
    }

    public function test_unscoped_staff_cannot_read_any_citizens(): void
    {
        [$assigned] = $this->villages();
        $this->citizenAt($assigned, 'Hidden');
        $user = $this->userWithPermission('village-coordinator', 'citizens.view');

        Sanctum::actingAs($user);

        $this->getJson('/api/citizens')->assertOk()->assertJsonPath('meta.total', 0);
    }

    public function test_mp_can_read_across_villages_without_a_local_assignment(): void
    {
        [$assigned, $outside] = $this->villages();
        $this->citizenAt($assigned, 'First');
        $this->citizenAt($outside, 'Second');
        $user = $this->userWithPermission('mp', 'citizens.view');

        Sanctum::actingAs($user);

        $this->getJson('/api/citizens')->assertOk()->assertJsonPath('meta.total', 2);
    }

    private function userWithPermission(string $roleSlug, string $permissionSlug, array $scope = []): User
    {
        $role = Role::create([
            'name' => ucfirst(str_replace('-', ' ', $roleSlug)),
            'slug' => $roleSlug,
            'level' => 5,
            'is_active' => true,
        ]);
        $permission = Permission::create([
            'name' => ucfirst(str_replace('.', ' ', $permissionSlug)),
            'slug' => $permissionSlug,
            'module' => explode('.', $permissionSlug)[0],
        ]);
        $role->permissions()->attach($permission);

        return User::factory()->create(['role_id' => $role->id] + $scope);
    }

    private function citizenAt(Village $village, string $name): Citizen
    {
        $citizen = Citizen::create([
            'unique_id' => 'CIT-'.strtoupper(fake()->unique()->bothify('??###')),
            'first_name' => $name,
            'last_name' => 'Citizen',
            'date_of_birth' => '1990-01-01',
            'gender' => 'Female',
            'is_voter' => false,
        ]);
        $citizen->addresses()->create([
            'address_type' => 'home',
            'village_id' => $village->id,
            'pincode' => '500001',
            'district' => 'Test',
            'state' => 'Andhra Pradesh',
            'is_primary' => true,
        ]);

        return $citizen;
    }

    private function villages(): array
    {
        $pc = Constituency::create([
            'name' => 'Test PC',
            'code' => fake()->unique()->bothify('PC-###'),
            'state' => 'Andhra Pradesh',
            'district' => 'Test',
        ]);
        $ac = AssemblyConstituency::create([
            'name' => 'Test AC',
            'code' => fake()->unique()->bothify('AC-###'),
            'constituency_id' => $pc->id,
        ]);
        $mandal = Mandal::create([
            'name' => 'Test Mandal',
            'code' => fake()->unique()->bothify('M-###'),
            'assembly_constituency_id' => $ac->id,
        ]);

        return [
            Village::create(['name' => 'Assigned Village', 'code' => fake()->unique()->bothify('V-###'), 'mandal_id' => $mandal->id]),
            Village::create(['name' => 'Outside Village', 'code' => fake()->unique()->bothify('V-###'), 'mandal_id' => $mandal->id]),
        ];
    }
}
