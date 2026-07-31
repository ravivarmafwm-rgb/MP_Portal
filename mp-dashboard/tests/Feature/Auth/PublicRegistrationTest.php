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

        $response = $this->csrf()->postJson('/api/register', [
            'first_name' => 'Asha', 'last_name' => 'Rao', 'email' => 'asha@gmail.com',
            'mobile_number' => '9876543210', 'date_of_birth' => '1992-05-14', 'gender' => 'Female',
            'password' => 'Secure!Citizen123', 'password_confirmation' => 'Secure!Citizen123',
        ]);

        $response->assertCreated()->assertJsonPath('user.role_slug', 'citizen');
        $citizenId = $response->json('user.citizen_id');
        $this->assertNotEmpty($citizenId);
        $this->assertDatabaseHas('users', ['email' => 'asha@gmail.com', 'role_id' => $citizen->id]);
        $this->assertDatabaseHas('citizens', ['id' => $citizenId, 'email' => 'asha@gmail.com', 'mobile_number' => '9876543210']);
        $this->assertDatabaseHas('users', ['email' => 'asha@gmail.com', 'citizen_id' => $citizenId]);
    }

    public function test_public_registration_rejects_any_role_input(): void
    {
        Role::create(['name' => 'Citizen', 'slug' => 'citizen', 'level' => 11, 'is_active' => true]);
        Role::create(['name' => 'Super Admin', 'slug' => 'super-admin', 'level' => 1, 'is_active' => true]);

        $this->csrf()->postJson('/api/register', [
            'first_name' => 'Role', 'last_name' => 'Attacker', 'email' => 'role.attacker@gmail.com',
            'mobile_number' => '9876543211', 'date_of_birth' => '1990-01-01', 'gender' => 'Other',
            'password' => 'Secure!Citizen123', 'password_confirmation' => 'Secure!Citizen123',
            'role_slug' => 'super-admin',
        ])->assertUnprocessable()->assertJsonValidationErrors('role_slug');

        $this->assertDatabaseMissing('users', ['email' => 'role.attacker@gmail.com']);
    }

    private function csrf()
    {
        return $this->withCookie(config('browser_auth.csrf_cookie'), 'registration-csrf')
            ->withHeader('X-CSRF-TOKEN', 'registration-csrf');
    }
}
