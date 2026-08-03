<?php

namespace Tests\Feature\Citizens;

use App\Models\ActivityLog;
use App\Models\AssemblyConstituency;
use App\Models\Citizen;
use App\Models\CitizenAddress;
use App\Models\Constituency;
use App\Models\Family;
use App\Models\Mandal;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use App\Models\Village;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class FamilyWorkflowTest extends TestCase
{
    use RefreshDatabase;

    public function test_family_membership_head_counts_and_audits_are_managed_transactionally(): void
    {
        [$village] = $this->villages();
        $admin = $this->superAdmin();
        $head = $this->citizen('CIT-FAM-1', 'Anita', true, $village);
        $member = $this->citizen('CIT-FAM-2', 'Ravi', false, $village);
        Sanctum::actingAs($admin);

        $family = $this->postJson('/api/families', [
            'head_citizen_id' => $head->id,
            'village_id' => $village->id,
            'economic_status' => 'middle',
            'is_bpl' => false,
        ])->assertCreated()
            ->assertJsonPath('members_count', 1)
            ->assertJsonPath('voters_count', 1)
            ->json();
        $this->getJson("/api/families/{$family['id']}")->assertOk()->assertJsonPath('family_id', $family['family_id']);

        $this->postJson("/api/families/{$family['id']}/members", [
            'citizen_id' => $member->id,
            'relationship_with_head' => 'Son',
            'is_head' => true,
        ])->assertCreated()
            ->assertJsonPath('members_count', 2)
            ->assertJsonPath('voters_count', 1)
            ->assertJsonPath('head_of_family_name', 'Ravi Citizen');

        $headMembership = \App\Models\FamilyMember::where('family_id', $family['id'])
            ->where('citizen_id', $head->id)->firstOrFail();
        $this->deleteJson("/api/families/{$family['id']}/members/{$headMembership->id}")
            ->assertOk()
            ->assertJsonPath('members_count', 1);

        $this->deleteJson("/api/families/{$family['id']}")->assertStatus(409);
        $this->assertDatabaseHas('activity_logs', [
            'loggable_id' => $family['id'],
            'action' => 'family_created',
        ]);
        $this->assertDatabaseHas('activity_logs', [
            'loggable_id' => $family['id'],
            'action' => 'family_member_removed',
        ]);
    }

    public function test_citizen_cannot_be_added_to_more_than_one_family(): void
    {
        [$village] = $this->villages();
        $admin = $this->superAdmin();
        $first = $this->citizen('CIT-DUP-1', 'First', true, $village);
        $second = $this->citizen('CIT-DUP-2', 'Second', true, $village);
        Sanctum::actingAs($admin);
        $payload = ['village_id' => $village->id, 'economic_status' => 'middle', 'is_bpl' => false];
        $this->postJson('/api/families', $payload + ['head_citizen_id' => $first->id])->assertCreated();
        $this->postJson('/api/families', $payload + ['head_citizen_id' => $first->id])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('citizen_id');
        $this->postJson('/api/families', $payload + ['head_citizen_id' => $second->id])->assertCreated();
    }

    public function test_family_access_and_creation_are_geographically_scoped(): void
    {
        [$ownVillage, $otherVillage] = $this->villages();
        $user = $this->familyUser($ownVillage);
        $otherHead = $this->citizen('CIT-OTHER', 'Outside', true, $otherVillage);
        $otherFamily = Family::create([
            'family_id' => 'FAM-OTHER', 'head_of_family_name' => 'Outside Citizen',
            'village_id' => $otherVillage->id, 'economic_status' => 'middle',
        ]);
        Sanctum::actingAs($user);

        $this->getJson('/api/families')->assertOk()->assertJsonMissing(['id' => $otherFamily->id]);
        $this->getJson("/api/families/{$otherFamily->id}")->assertForbidden();
        $this->postJson('/api/families', [
            'head_citizen_id' => $otherHead->id, 'village_id' => $otherVillage->id,
            'economic_status' => 'middle', 'is_bpl' => false,
        ])->assertForbidden();
    }

    public function test_family_member_routes_reject_members_from_another_family(): void
    {
        [$village] = $this->villages();
        $admin = $this->superAdmin();
        $firstHead = $this->citizen('CIT-OWN-1', 'First', true, $village);
        $secondHead = $this->citizen('CIT-OWN-2', 'Second', true, $village);
        Sanctum::actingAs($admin);
        $first = $this->postJson('/api/families', ['head_citizen_id' => $firstHead->id, 'village_id' => $village->id, 'economic_status' => 'middle', 'is_bpl' => false])->assertCreated()->json();
        $second = $this->postJson('/api/families', ['head_citizen_id' => $secondHead->id, 'village_id' => $village->id, 'economic_status' => 'middle', 'is_bpl' => false])->assertCreated()->json();
        $member = \App\Models\FamilyMember::where('family_id', $second['id'])->firstOrFail();
        $this->deleteJson("/api/families/{$first['id']}/members/{$member->id}")->assertNotFound();
    }

    private function citizen(string $id, string $firstName, bool $voter, Village $village): Citizen
    {
        $citizen = Citizen::create([
            'unique_id' => $id, 'first_name' => $firstName, 'last_name' => 'Citizen',
            'date_of_birth' => today()->subYears(30), 'gender' => 'Female', 'is_voter' => $voter,
        ]);
        CitizenAddress::create([
            'citizen_id' => $citizen->id, 'address_type' => 'permanent',
            'village_id' => $village->id, 'is_primary' => true,
        ]);
        return $citizen;
    }

    private function superAdmin(): User
    {
        $role = Role::create(['name' => 'Super Admin', 'slug' => 'super-admin', 'level' => 1, 'is_active' => true]);
        return User::factory()->create(['role_id' => $role->id]);
    }

    private function familyUser(Village $village): User
    {
        $role = Role::create(['name' => 'Family Coordinator', 'slug' => 'family-coordinator', 'level' => 5, 'is_active' => true]);
        $permission = Permission::create(['name' => 'Manage families', 'slug' => 'families.manage', 'module' => 'citizens']);
        $role->permissions()->attach($permission);
        return User::factory()->create([
            'role_id' => $role->id, 'constituency_id' => $village->mandal->assemblyConstituency->constituency_id,
            'assembly_constituency_id' => $village->mandal->assembly_constituency_id,
            'mandal_id' => $village->mandal_id, 'village_id' => $village->id,
        ]);
    }

    private function villages(): array
    {
        $constituency = Constituency::create(['name' => 'Family Test PC', 'code' => fake()->unique()->bothify('PC-###'), 'state' => 'Test', 'district' => 'Test']);
        $assembly = AssemblyConstituency::create(['name' => 'Family Test AC', 'code' => fake()->unique()->bothify('AC-###'), 'constituency_id' => $constituency->id]);
        $mandal = Mandal::create(['name' => 'Family Test Mandal', 'code' => fake()->unique()->bothify('MD-###'), 'assembly_constituency_id' => $assembly->id]);
        return [
            Village::create(['name' => 'Family Village One', 'code' => fake()->unique()->bothify('V-###'), 'mandal_id' => $mandal->id]),
            Village::create(['name' => 'Family Village Two', 'code' => fake()->unique()->bothify('V-###'), 'mandal_id' => $mandal->id]),
        ];
    }
}
