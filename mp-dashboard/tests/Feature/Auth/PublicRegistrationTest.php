<?php

namespace Tests\Feature\Auth;

use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicRegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_registration_always_creates_a_citizen(): void
    {
        $citizen = Role::create(['name' => 'Citizen', 'slug' => 'citizen', 'level' => 11, 'is_active' => true]);

        $response = $this->postJson('/api/register', [
            'name' => 'Asha Rao', 'email' => 'asha@example.test',
            'password' => 'Secure!Citizen123', 'password_confirmation' => 'Secure!Citizen123',
        ]);

        $response->assertCreated()->assertJsonPath('user.role_slug', 'citizen');
        $this->assertDatabaseHas('users', ['email' => 'asha@example.test', 'role_id' => $citizen->id]);
    }

    public function test_public_registration_rejects_any_role_input(): void
    {
        Role::create(['name' => 'Citizen', 'slug' => 'citizen', 'level' => 11, 'is_active' => true]);
        Role::create(['name' => 'Super Admin', 'slug' => 'super-admin', 'level' => 1, 'is_active' => true]);

        $this->postJson('/api/register', [
            'name' => 'Attacker', 'email' => 'attacker@example.test',
            'password' => 'Secure!Citizen123', 'password_confirmation' => 'Secure!Citizen123',
            'role_slug' => 'super-admin',
        ])->assertUnprocessable()->assertJsonValidationErrors('role_slug');

        $this->assertDatabaseMissing('users', ['email' => 'attacker@example.test']);
    }
}
