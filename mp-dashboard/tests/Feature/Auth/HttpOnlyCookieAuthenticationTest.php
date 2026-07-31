<?php

namespace Tests\Feature\Auth;

use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HttpOnlyCookieAuthenticationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        config()->set('browser_auth.secure', false);
    }

    public function test_registration_requires_csrf_and_returns_an_http_only_access_cookie(): void
    {
        Role::create(['name' => 'Citizen', 'slug' => 'citizen', 'level' => 11, 'is_active' => true]);
        $payload = $this->registrationPayload();

        $this->postJson('/api/register', $payload)->assertStatus(419);

        $response = $this->withCookie(config('browser_auth.csrf_cookie'), 'csrf-value')
            ->withHeader('X-CSRF-TOKEN', 'csrf-value')
            ->postJson('/api/register', $payload)
            ->assertCreated()
            ->assertJsonMissingPath('access_token')
            ->assertCookie(config('browser_auth.access_cookie'));

        $cookie = collect($response->headers->getCookies())
            ->first(fn ($item) => $item->getName() === config('browser_auth.access_cookie'));
        $this->assertNotNull($cookie);
        $this->assertTrue($cookie->isHttpOnly());
        $this->assertSame('lax', $cookie->getSameSite());

        $this->withCookie(config('browser_auth.access_cookie'), $cookie->getValue())
            ->getJson('/api/user')
            ->assertOk()
            ->assertJsonPath('role_slug', 'citizen');
    }

    public function test_authenticated_cookie_mutations_require_matching_csrf_and_logout_revokes_session(): void
    {
        Role::create(['name' => 'Citizen', 'slug' => 'citizen', 'level' => 11, 'is_active' => true]);
        $response = $this->withCookie(config('browser_auth.csrf_cookie'), 'csrf-value')
            ->withHeader('X-CSRF-TOKEN', 'csrf-value')
            ->postJson('/api/register', $this->registrationPayload());
        $access = collect($response->headers->getCookies())
            ->first(fn ($item) => $item->getName() === config('browser_auth.access_cookie'));

        $this->withCookie(config('browser_auth.access_cookie'), $access->getValue())
            ->withCookie(config('browser_auth.csrf_cookie'), 'csrf-value')
            ->withHeader('X-CSRF-TOKEN', 'wrong')
            ->postJson('/api/logout')
            ->assertStatus(419);

        $this->withCookie(config('browser_auth.access_cookie'), $access->getValue())
            ->withCookie(config('browser_auth.csrf_cookie'), 'csrf-value')
            ->withHeader('X-CSRF-TOKEN', 'csrf-value')
            ->postJson('/api/logout')
            ->assertOk()
            ->assertCookieExpired(config('browser_auth.access_cookie'));
        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    private function registrationPayload(): array
    {
        return [
            'first_name' => 'Cookie',
            'last_name' => 'Citizen',
            'email' => 'cookie.citizen@gmail.com',
            'mobile_number' => '9876543220',
            'date_of_birth' => '1990-01-01',
            'gender' => 'Other',
            'password' => 'Secure!Citizen123',
            'password_confirmation' => 'Secure!Citizen123',
        ];
    }
}
