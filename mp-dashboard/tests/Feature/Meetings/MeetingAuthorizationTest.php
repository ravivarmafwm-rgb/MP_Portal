<?php

namespace Tests\Feature\Meetings;

use App\Models\Appointment;
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

class MeetingAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_meeting_lists_and_records_are_restricted_to_assigned_geography(): void
    {
        [$firstVillage, $secondVillage] = $this->villages();
        $user = $this->meetingUser($firstVillage);
        $visible = $this->appointment('APT-001', $firstVillage, $user);
        $hidden = $this->appointment('APT-002', $secondVillage, $user);
        Sanctum::actingAs($user);

        $this->getJson('/api/meetings/appointments')
            ->assertOk()
            ->assertJsonFragment(['id' => $visible->id])
            ->assertJsonMissing(['id' => $hidden->id]);

        $this->getJson("/api/meetings/appointments/{$visible->id}")->assertOk();
        $this->getJson("/api/meetings/appointments/{$hidden->id}")->assertForbidden();
    }

    public function test_meeting_creation_rejects_geography_outside_the_users_scope(): void
    {
        [$firstVillage, $secondVillage] = $this->villages();
        $user = $this->meetingUser($firstVillage);
        Sanctum::actingAs($user);

        $payload = [
            'citizen_name' => 'Test Citizen',
            'purpose' => 'Constituency issue',
            'requested_date' => now()->toDateString(),
            'village_id' => $secondVillage->id,
        ];

        $this->postJson('/api/meetings/appointments', $payload)->assertForbidden();

        $response = $this->postJson('/api/meetings/appointments', [
            ...$payload,
            'village_id' => $firstVillage->id,
        ])->assertCreated();

        $this->assertDatabaseHas('appointments', [
            'id' => $response->json('id'),
            'village_id' => $firstVillage->id,
            'mandal_id' => $firstVillage->mandal_id,
        ]);
    }

    public function test_staff_without_an_assigned_geography_cannot_see_meeting_records(): void
    {
        [$village] = $this->villages();
        $scopedUser = $this->meetingUser($village);
        $appointment = $this->appointment('APT-003', $village, $scopedUser);
        $unscopedUser = $this->meetingUser();
        Sanctum::actingAs($unscopedUser);

        $this->getJson('/api/meetings/appointments')
            ->assertOk()
            ->assertJsonPath('meta.total', 0);
        $this->getJson("/api/meetings/appointments/{$appointment->id}")->assertForbidden();
    }

    private function meetingUser(?Village $village = null): User
    {
        $role = Role::create([
            'name' => 'Coordinator '.fake()->unique()->word(),
            'slug' => 'coordinator-'.fake()->unique()->slug(),
            'level' => 5,
            'is_active' => true,
        ]);
        foreach (['meetings.view', 'meetings.manage'] as $slug) {
            $permission = Permission::firstOrCreate(
                ['slug' => $slug],
                ['name' => $slug, 'module' => 'meetings']
            );
            $role->permissions()->attach($permission);
        }

        return User::factory()->create([
            'role_id' => $role->id,
            'constituency_id' => $village?->mandal?->assemblyConstituency?->constituency_id,
            'assembly_constituency_id' => $village?->mandal?->assembly_constituency_id,
            'mandal_id' => $village?->mandal_id,
            'village_id' => $village?->id,
        ]);
    }

    private function appointment(string $number, Village $village, User $creator): Appointment
    {
        return Appointment::create([
            'appointment_number' => $number,
            'citizen_name' => 'Test Citizen',
            'purpose' => 'Public issue',
            'requested_date' => now()->toDateString(),
            'constituency_id' => $village->mandal->assemblyConstituency->constituency_id,
            'assembly_constituency_id' => $village->mandal->assembly_constituency_id,
            'mandal_id' => $village->mandal_id,
            'village_id' => $village->id,
            'created_by' => $creator->id,
        ]);
    }

    private function villages(): array
    {
        $constituency = Constituency::create([
            'name' => 'Test Constituency',
            'code' => fake()->unique()->bothify('PC-###'),
            'state' => 'Test State',
            'district' => 'Test District',
        ]);
        $assembly = AssemblyConstituency::create([
            'name' => 'Test Assembly',
            'code' => fake()->unique()->bothify('AC-###'),
            'constituency_id' => $constituency->id,
        ]);
        $mandal = Mandal::create([
            'name' => 'Test Mandal',
            'code' => fake()->unique()->bothify('MD-###'),
            'assembly_constituency_id' => $assembly->id,
        ]);

        return [
            Village::create(['name' => 'Village One', 'code' => fake()->unique()->bothify('V-###'), 'mandal_id' => $mandal->id]),
            Village::create(['name' => 'Village Two', 'code' => fake()->unique()->bothify('V-###'), 'mandal_id' => $mandal->id]),
        ];
    }
}
