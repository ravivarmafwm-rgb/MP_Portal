<?php

namespace Tests\Feature\Analytics;

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

class ParliamentaryAnalyticsTest extends TestCase
{
    use RefreshDatabase;

    public function test_analytics_requires_the_explicit_permission(): void
    {
        $role = Role::create(['name' => 'Citizen', 'slug' => 'citizen', 'level' => 10, 'is_active' => true]);
        $user = User::factory()->create(['role_id' => $role->id]);
        Sanctum::actingAs($user);

        $this->getJson('/api/analytics/village')->assertForbidden();
    }

    public function test_village_report_is_limited_to_the_users_geographic_scope(): void
    {
        $role = Role::create(['name' => 'Village Coordinator', 'slug' => 'village-coordinator', 'level' => 8, 'is_active' => true]);
        $permission = Permission::create(['name' => 'Analytics View', 'slug' => 'analytics.view', 'module' => 'analytics']);
        $role->permissions()->attach($permission);
        $constituency = Constituency::create(['name' => 'Test PC', 'code' => 'PC-TEST', 'state' => 'Telangana', 'district' => 'Test']);
        $assembly = AssemblyConstituency::create(['name' => 'Test AC', 'code' => 'AC-TEST', 'constituency_id' => $constituency->id]);
        $mandal = Mandal::create(['name' => 'Test Mandal', 'code' => 'MAN-TEST', 'assembly_constituency_id' => $assembly->id]);
        $assigned = Village::create(['name' => 'Assigned Village', 'code' => 'VIL-A', 'mandal_id' => $mandal->id]);
        Village::create(['name' => 'Outside Village', 'code' => 'VIL-B', 'mandal_id' => $mandal->id]);
        $user = User::factory()->create(['role_id' => $role->id, 'village_id' => $assigned->id]);
        Sanctum::actingAs($user);

        $this->getJson('/api/analytics/village')->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $assigned->id)
            ->assertJsonPath('data.0.name', 'Assigned Village');
    }

    public function test_unknown_analytics_level_returns_not_found(): void
    {
        $role = Role::create(['name' => 'MP', 'slug' => 'mp', 'level' => 2, 'is_active' => true]);
        $permission = Permission::create(['name' => 'Analytics View', 'slug' => 'analytics.view', 'module' => 'analytics']);
        $role->permissions()->attach($permission);
        $user = User::factory()->create(['role_id' => $role->id]);
        Sanctum::actingAs($user);

        $this->getJson('/api/analytics/city')->assertNotFound();
    }
}
