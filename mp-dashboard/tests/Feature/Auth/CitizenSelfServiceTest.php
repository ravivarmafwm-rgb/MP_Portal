<?php

namespace Tests\Feature\Auth;

use App\Models\Citizen;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CitizenSelfServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_citizen_can_only_load_the_explicitly_linked_profile(): void
    {
        $role = Role::create(['name' => 'Citizen', 'slug' => 'citizen', 'level' => 11, 'is_active' => true]);
        $own = $this->citizen('CIT-OWN', 'Anita', 'Rao', '9876543201');
        $other = $this->citizen('CIT-OTHER', 'Other', 'Person', '9876543202');
        $user = User::factory()->create(['role_id' => $role->id, 'citizen_id' => $own->id]);
        Sanctum::actingAs($user);

        $this->getJson('/api/citizen/me')
            ->assertOk()
            ->assertJsonPath('id', $own->id)
            ->assertJsonPath('unique_id', 'CIT-OWN')
            ->assertJsonMissing(['id' => $other->id]);

        $this->getJson("/api/citizens/{$other->id}")->assertForbidden();
    }

    public function test_unlinked_citizen_account_receives_an_explicit_conflict(): void
    {
        $role = Role::create(['name' => 'Citizen', 'slug' => 'citizen', 'level' => 11, 'is_active' => true]);
        Sanctum::actingAs(User::factory()->create(['role_id' => $role->id]));

        $this->getJson('/api/citizen/me')
            ->assertStatus(409)
            ->assertJsonPath('message', 'This account is not linked to a citizen record. Contact the constituency office.');
    }

    private function citizen(string $uniqueId, string $firstName, string $lastName, string $mobile): Citizen
    {
        return Citizen::create([
            'unique_id' => $uniqueId,
            'first_name' => $firstName,
            'last_name' => $lastName,
            'date_of_birth' => '1990-01-01',
            'gender' => 'Female',
            'mobile_number' => $mobile,
        ]);
    }
}
