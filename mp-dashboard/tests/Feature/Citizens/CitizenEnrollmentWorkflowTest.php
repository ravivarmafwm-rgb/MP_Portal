<?php

namespace Tests\Feature\Citizens;

use App\Models\AssemblyConstituency;
use App\Models\Constituency;
use App\Models\Mandal;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use App\Models\Village;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CitizenEnrollmentWorkflowTest extends TestCase
{
    use RefreshDatabase;

    public function test_enrollment_and_update_are_validated_encrypted_audited_and_archivable(): void
    {
        $village = $this->village();
        $admin = $this->user('super-admin');
        Sanctum::actingAs($admin);

        $id = $this->postJson('/api/citizens', [
            'first_name' => 'Meera', 'last_name' => 'Rao',
            'date_of_birth' => '1990-04-10', 'gender' => 'Female',
            'mobile_number' => '9876543210', 'aadhaar_number' => '123412341234',
            'is_voter' => true, 'village_id' => $village->id,
            'pincode' => '500001', 'district' => 'Test District', 'state' => 'Telangana',
        ])->assertCreated()
            ->assertJsonPath('aadhaar_masked', 'XXXX XXXX 1234')
            ->assertJsonMissingPath('aadhaar_number')
            ->json('id');

        $this->assertDatabaseHas('citizens', ['id' => $id, 'aadhaar_number' => null]);
        $this->assertDatabaseHas('activity_logs', ['loggable_id' => $id, 'action' => 'citizen_created']);
        $this->putJson("/api/citizens/{$id}", ['occupation' => 'Teacher'])
            ->assertOk()->assertJsonPath('occupation', 'Teacher');
        $this->assertDatabaseHas('activity_logs', ['loggable_id' => $id, 'action' => 'citizen_updated']);
        $this->deleteJson("/api/citizens/{$id}")->assertNoContent();
        $this->assertSoftDeleted('citizens', ['id' => $id]);
        $this->assertSoftDeleted('citizen_addresses', ['citizen_id' => $id]);
    }

    public function test_duplicate_identity_and_invalid_required_address_are_rejected(): void
    {
        $village = $this->village();
        Sanctum::actingAs($this->user('super-admin'));
        $payload = [
            'first_name' => 'A', 'last_name' => 'Citizen',
            'date_of_birth' => '1990-04-10', 'gender' => 'Female',
            'mobile_number' => '9876543210', 'aadhaar_number' => '123412341234',
            'is_voter' => false, 'village_id' => $village->id,
            'pincode' => '500001', 'district' => 'Test', 'state' => 'Telangana',
        ];
        $this->postJson('/api/citizens', $payload)->assertCreated();
        $this->postJson('/api/citizens', [...$payload, 'mobile_number' => '9876543211'])
            ->assertUnprocessable()->assertJsonValidationErrors('aadhaar_number');
        $this->postJson('/api/citizens', [...collect($payload)->except('pincode')->all(), 'mobile_number' => '9876543212', 'aadhaar_number' => null])
            ->assertUnprocessable()->assertJsonValidationErrors('pincode');
    }

    public function test_staff_without_geographic_assignment_cannot_access_citizen_records(): void
    {
        $village = $this->village();
        $admin = $this->user('super-admin');
        Sanctum::actingAs($admin);
        $id = $this->postJson('/api/citizens', [
            'first_name' => 'Scoped', 'last_name' => 'Citizen',
            'date_of_birth' => '1990-04-10', 'gender' => 'Male', 'is_voter' => false,
            'village_id' => $village->id, 'pincode' => '500001', 'district' => 'Test', 'state' => 'Telangana',
        ])->assertCreated()->json('id');

        Sanctum::actingAs($this->user('staff', ['citizens.view', 'citizens.update']));
        $this->getJson('/api/citizens')->assertOk()->assertJsonPath('meta.total', 0);
        $this->getJson("/api/citizens/{$id}")->assertForbidden();
        $this->putJson("/api/citizens/{$id}", ['occupation' => 'Blocked'])->assertForbidden();
    }

    private function user(string $slug, array $permissions = []): User
    {
        $role = Role::create(['name' => ucfirst($slug).' '.fake()->unique()->word(), 'slug' => $slug.'-'.fake()->unique()->word(), 'level' => 5, 'is_active' => true]);
        if ($slug === 'super-admin') $role->update(['slug' => 'super-admin']);
        foreach ($permissions as $permissionSlug) {
            $permission = Permission::firstOrCreate(['slug' => $permissionSlug], ['name' => $permissionSlug, 'module' => 'citizens']);
            $role->permissions()->attach($permission);
        }
        return User::factory()->create(['role_id' => $role->id]);
    }

    private function village(): Village
    {
        $constituency = Constituency::create(['name' => 'Citizen Test PC', 'code' => fake()->unique()->bothify('PC-###'), 'state' => 'Test', 'district' => 'Test']);
        $assembly = AssemblyConstituency::create(['name' => 'Citizen Test AC', 'code' => fake()->unique()->bothify('AC-###'), 'constituency_id' => $constituency->id]);
        $mandal = Mandal::create(['name' => 'Citizen Test Mandal', 'code' => fake()->unique()->bothify('MD-###'), 'assembly_constituency_id' => $assembly->id]);
        return Village::create(['name' => 'Citizen Test Village', 'code' => fake()->unique()->bothify('V-###'), 'mandal_id' => $mandal->id]);
    }
}
