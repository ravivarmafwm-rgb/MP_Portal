<?php

namespace Tests\Feature\Citizens;

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

class CitizenAddressWorkflowTest extends TestCase
{
    use RefreshDatabase;

    public function test_address_crud_is_scoped_validated_audited_and_paginated(): void
    {
        $village = $this->village();
        Sanctum::actingAs($this->user('super-admin'));
        $citizen = $this->postJson('/api/citizens', [
            'first_name' => 'Address', 'last_name' => 'Citizen', 'date_of_birth' => '1990-01-01', 'gender' => 'Female',
            'is_voter' => false, 'village_id' => $village->id, 'pincode' => '500001', 'district' => 'Test', 'state' => 'Andhra Pradesh',
        ])->assertCreated()->json();
        $created = $this->postJson("/api/citizens/{$citizen['id']}/addresses", [
            'address_type' => 'temporary', 'house_number' => '12', 'pincode' => '500002', 'district' => 'Test', 'state' => 'Andhra Pradesh', 'is_primary' => true,
        ])->assertCreated()->assertJsonPath('address_type', 'temporary')->json('id');
        $this->getJson("/api/citizens/{$citizen['id']}/addresses?search=500002")->assertOk()->assertJsonPath('meta.total', 1);
        $this->putJson("/api/citizens/{$citizen['id']}/addresses/{$created}", ['house_number' => '14'])->assertOk()->assertJsonPath('house_number', '14');
        $this->assertDatabaseHas('activity_logs', ['loggable_id' => $citizen['id'], 'action' => 'citizen_address_updated']);
        $this->deleteJson("/api/citizens/{$citizen['id']}/addresses/{$created}")->assertNoContent();
        $this->assertSoftDeleted('citizen_addresses', ['id' => $created]);
    }

    public function test_invalid_pincode_and_cross_citizen_address_access_are_rejected(): void
    {
        $village = $this->village(); Sanctum::actingAs($this->user('super-admin'));
        $citizen = Citizen::create(['unique_id' => 'CIT-TEST', 'first_name' => 'A', 'last_name' => 'B', 'date_of_birth' => '1990-01-01', 'gender' => 'Male']);
        $this->postJson("/api/citizens/{$citizen->id}/addresses", ['address_type' => 'home', 'pincode' => '123', 'district' => 'D', 'state' => 'S'])->assertUnprocessable()->assertJsonValidationErrors('pincode');
        $other = Citizen::create(['unique_id' => 'CIT-OTHER', 'first_name' => 'C', 'last_name' => 'D', 'date_of_birth' => '1990-01-01', 'gender' => 'Male']);
        $address = $citizen->addresses()->create(['address_type' => 'home', 'pincode' => '500001', 'district' => 'D', 'state' => 'S']);
        $this->getJson("/api/citizens/{$other->id}/addresses")->assertOk();
        $this->deleteJson("/api/citizens/{$other->id}/addresses/{$address->id}")->assertNotFound();
    }

    private function user(string $slug): User
    {
        $role = Role::create(['name' => ucfirst($slug), 'slug' => $slug, 'level' => 5, 'is_active' => true]);
        return User::factory()->create(['role_id' => $role->id]);
    }

    private function village(): Village
    {
        $pc = Constituency::create(['name' => 'Test PC', 'code' => fake()->unique()->bothify('PC-###'), 'state' => 'Test', 'district' => 'Test']);
        $ac = AssemblyConstituency::create(['name' => 'Test AC', 'code' => fake()->unique()->bothify('AC-###'), 'constituency_id' => $pc->id]);
        $mandal = Mandal::create(['name' => 'Test Mandal', 'code' => fake()->unique()->bothify('M-###'), 'assembly_constituency_id' => $ac->id]);
        return Village::create(['name' => 'Test Village', 'code' => fake()->unique()->bothify('V-###'), 'mandal_id' => $mandal->id]);
    }
}
