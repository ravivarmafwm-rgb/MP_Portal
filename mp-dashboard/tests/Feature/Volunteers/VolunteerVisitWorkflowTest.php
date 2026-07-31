<?php

namespace Tests\Feature\Volunteers;

use App\Models\Role;
use App\Models\User;
use App\Models\Volunteer;
use App\Models\Village;
use App\Models\Mandal;
use App\Models\AssemblyConstituency;
use App\Models\Constituency;
use App\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class VolunteerVisitWorkflowTest extends TestCase
{
    use RefreshDatabase;

    public function test_visit_lifecycle_records_gps_and_audit_events(): void
    {
        $role = Role::create(['name' => 'Volunteer', 'slug' => 'volunteer', 'level' => 5, 'is_active' => true]);
        $volunteerUser = User::factory()->create(['role_id' => $role->id]);
        $staffRole = Role::create(['name' => 'MP Staff', 'slug' => 'mp-staff', 'level' => 3, 'is_active' => true]);
        $user = User::factory()->create(['role_id' => $staffRole->id]);
        $village = $this->village();
        $user->update(['village_id' => $village->id]);
        $staffRole->permissions()->attach([
            Permission::create(['name' => 'View volunteer visits', 'slug' => 'volunteer_visits.view', 'module' => 'volunteers'])->id,
            Permission::create(['name' => 'Manage volunteer visits', 'slug' => 'volunteer_visits.manage', 'module' => 'volunteers'])->id,
            Permission::create(['name' => 'Update volunteer visits', 'slug' => 'volunteer_visits.update', 'module' => 'volunteers'])->id,
        ]);
        $volunteer = Volunteer::create(['user_id' => $volunteerUser->id, 'volunteer_id' => 'VOL-TEST', 'first_name' => 'Field', 'last_name' => 'Volunteer', 'date_of_birth' => '1990-01-01', 'gender' => 'Other', 'mobile_number' => '9876543210', 'joining_date' => today(), 'village_id' => $village->id, 'status' => 'active']);
        Sanctum::actingAs($user);
        $visit = $this->postJson('/api/volunteer-visits', [
            'volunteer_id' => $volunteer->id, 'village_id' => $volunteer->village_id,
            'visit_type' => 'household', 'scheduled_at' => now()->addDay()->toIso8601String(),
        ]);
        $visit->assertCreated();
        $id = $visit->json('id');
        $this->postJson("/api/volunteer-visits/{$id}/check-in", ['latitude' => 17.385, 'longitude' => 78.486])->assertOk()->assertJsonPath('status', 'checked_in');
        $this->postJson("/api/volunteer-visits/{$id}/complete", ['latitude' => 17.386, 'longitude' => 78.487, 'outcome' => 'Household contacted.'])->assertOk()->assertJsonPath('status', 'completed');
        $this->assertDatabaseHas('activity_logs', ['loggable_id' => $id, 'action' => 'visit_checked_in']);
        $this->assertDatabaseHas('activity_logs', ['loggable_id' => $id, 'action' => 'visit_completed']);
    }

    private function village(): Village
    {
        $pc = Constituency::create(['name' => 'Visit PC', 'code' => fake()->unique()->bothify('PC-###'), 'state' => 'Test', 'district' => 'Test']);
        $ac = AssemblyConstituency::create(['name' => 'Visit AC', 'code' => fake()->unique()->bothify('AC-###'), 'constituency_id' => $pc->id]);
        $mandal = Mandal::create(['name' => 'Visit Mandal', 'code' => fake()->unique()->bothify('M-###'), 'assembly_constituency_id' => $ac->id]);
        return Village::create(['name' => 'Visit Village', 'code' => fake()->unique()->bothify('V-###'), 'mandal_id' => $mandal->id]);
    }
}
