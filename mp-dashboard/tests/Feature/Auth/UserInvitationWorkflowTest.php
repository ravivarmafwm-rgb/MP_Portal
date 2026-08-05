<?php

namespace Tests\Feature\Auth;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserInvitationWorkflowTest extends TestCase
{
    use RefreshDatabase;

    public function test_super_admin_can_invite_an_official_and_the_invitation_can_be_used_once(): void
    {
        $superAdminRole = Role::create(['name' => 'Super Admin', 'slug' => 'super-admin', 'level' => 1, 'is_active' => true]);
        $mpRole = Role::create(['name' => 'MP', 'slug' => 'mp', 'level' => 2, 'is_active' => true]);
        $admin = User::factory()->create(['role_id' => $superAdminRole->id]);

        $inviteResponse = $this->actingAs($admin, 'sanctum')->postJson('/api/user-invitations', [
            'name' => 'Constituency MP',
            'email' => 'mp.office@gmail.com',
            'role_slug' => 'mp',
        ])->assertCreated()->assertJsonPath('role', 'MP');

        $url = $inviteResponse->json('registration_url');
        parse_str((string) parse_url($url, PHP_URL_QUERY), $query);
        $token = $query['token'] ?? null;
        $this->assertIsString($token);
        $this->assertSame(64, strlen($token));

        $this->getJson('/api/official-register/'.$token)
            ->assertOk()
            ->assertJsonPath('email', 'mp.office@gmail.com')
            ->assertJsonPath('role_slug', 'mp');

        $this->postJson('/api/official-register', [
            'token' => $token,
            'password' => 'Strong!Password123',
            'password_confirmation' => 'Strong!Password123',
        ])->assertOk()->assertJsonPath('user.role_slug', 'mp');

        $this->assertDatabaseHas('users', ['email' => 'mp.office@gmail.com', 'role_id' => $mpRole->id]);
        $this->assertDatabaseMissing('user_invitations', ['email' => 'mp.office@gmail.com', 'accepted_at' => null]);

        $this->postJson('/api/official-register', [
            'token' => $token,
            'password' => 'Another!Password123',
            'password_confirmation' => 'Another!Password123',
        ])->assertNotFound();
    }

    public function test_non_super_admin_cannot_issue_an_official_invitation(): void
    {
        $citizenRole = Role::create(['name' => 'Citizen', 'slug' => 'citizen', 'level' => 11, 'is_active' => true]);
        $citizen = User::factory()->create(['role_id' => $citizenRole->id]);

        $this->actingAs($citizen, 'sanctum')->getJson('/api/user-invitations')->assertForbidden();
        $this->actingAs($citizen, 'sanctum')->postJson('/api/user-invitations', [
            'name' => 'Escalation Attempt',
            'email' => 'escalation@example.com',
            'role_slug' => 'super-admin',
        ])->assertForbidden();
    }

    public function test_public_registration_remains_citizen_only(): void
    {
        $citizenRole = Role::create(['name' => 'Citizen', 'slug' => 'citizen', 'level' => 11, 'is_active' => true]);
        Role::create(['name' => 'MP', 'slug' => 'mp', 'level' => 2, 'is_active' => true]);

        $response = $this->withCookie(config('browser_auth.csrf_cookie'), 'csrf-value')
            ->withHeader('X-CSRF-TOKEN', 'csrf-value')
            ->postJson('/api/register', [
                'first_name' => 'Public',
                'last_name' => 'Citizen',
                'email' => 'public.citizen@gmail.com',
                'mobile_number' => '9876543210',
                'date_of_birth' => '1990-01-01',
                'gender' => 'Other',
                'password' => 'Secure!Citizen123',
                'password_confirmation' => 'Secure!Citizen123',
            ])->assertCreated();

        $this->assertSame($citizenRole->id, User::where('email', 'public.citizen@gmail.com')->value('role_id'));
        $this->assertFalse(User::where('email', 'public.citizen@gmail.com')->first()->hasRole('mp'));
    }
}
