<?php

namespace Tests\Feature\Grievances;

use App\Models\AssemblyConstituency;
use App\Models\Constituency;
use App\Models\Department;
use App\Models\Grievance;
use App\Models\GrievanceCategory;
use App\Models\Mandal;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use App\Models\Village;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use App\Services\GrievanceEscalationService;
use App\Models\Citizen;
use App\Models\CitizenAddress;

class GrievanceAssignmentWorkflowTest extends TestCase
{
    use RefreshDatabase;

    public function test_assignment_creates_handoff_history_sla_audit_and_notification(): void
    {
        [$firstVillage] = $this->villages();
        $department = Department::create(['name' => 'Public Works', 'code' => 'PWD', 'is_active' => true]);
        $actor = $this->superAdmin();
        $officer = $this->officer($department, $firstVillage);
        $grievance = $this->grievance($firstVillage, $actor);
        Sanctum::actingAs($actor);

        $this->postJson("/api/grievances/{$grievance->id}/assign", [
            'assigned_to' => $officer->id,
            'department_id' => $department->id,
            'instructions' => 'Inspect the affected road and upload the field report.',
        ])->assertOk()
            ->assertJsonPath('status', 'assigned')
            ->assertJsonPath('assigned_to.id', $officer->id)
            ->assertJsonPath('assigned_department.id', $department->id);

        $this->assertDatabaseHas('grievance_assignments', [
            'grievance_id' => $grievance->id,
            'assigned_to' => $officer->id,
            'department_id' => $department->id,
            'status' => 'assigned',
        ]);
        $this->assertDatabaseHas('grievance_updates', [
            'grievance_id' => $grievance->id,
            'update_type' => 'assignment',
            'to_status' => 'assigned',
        ]);
        $this->assertDatabaseHas('activity_logs', [
            'loggable_id' => $grievance->id,
            'action' => 'assigned',
        ]);
        $this->assertDatabaseHas('notifications', [
            'user_id' => $officer->id,
            'title' => 'Grievance Assigned',
        ]);
        $this->assertNotNull($grievance->fresh()->due_date);
    }

    public function test_assignment_rejects_an_officer_outside_the_grievance_geography(): void
    {
        [$firstVillage, $secondVillage] = $this->villages();
        $department = Department::create(['name' => 'Water Supply', 'code' => 'WTR', 'is_active' => true]);
        $actor = $this->superAdmin();
        $outsideOfficer = $this->officer($department, $secondVillage);
        $grievance = $this->grievance($firstVillage, $actor);
        Sanctum::actingAs($actor);

        $this->postJson("/api/grievances/{$grievance->id}/assign", [
            'assigned_to' => $outsideOfficer->id,
            'department_id' => $department->id,
            'instructions' => 'Investigate.',
        ])->assertUnprocessable()->assertJsonValidationErrors('assigned_to');

        $this->assertDatabaseMissing('grievance_assignments', ['grievance_id' => $grievance->id]);
    }

    public function test_overdue_grievances_are_escalated_once_with_auditable_history(): void
    {
        [$village] = $this->villages();
        $department = Department::create(['name' => 'Revenue', 'code' => 'REV', 'is_active' => true]);
        $creator = $this->superAdmin();
        $officer = $this->officer($department, $village);
        $grievance = $this->grievance($village, $creator);
        $grievance->update([
            'status' => 'assigned',
            'assigned_to' => $officer->id,
            'assigned_department_id' => $department->id,
            'due_date' => today()->subDay(),
        ]);
        $service = app(GrievanceEscalationService::class);

        $this->assertSame(1, $service->processOverdue());
        $this->assertSame(0, $service->processOverdue());
        $this->assertDatabaseCount('grievance_escalations', 1);
        $this->assertDatabaseHas('grievance_escalations', [
            'grievance_id' => $grievance->id,
            'reason' => 'sla_breach',
            'status' => 'pending',
        ]);
        $this->assertDatabaseHas('grievance_updates', [
            'grievance_id' => $grievance->id,
            'update_type' => 'escalation',
        ]);
        $this->assertSame('escalated', $grievance->fresh()->status);
    }

    public function test_assigned_officer_accepts_resolves_and_closes_through_valid_transitions(): void
    {
        [$village] = $this->villages();
        $department = Department::create(['name' => 'Electricity', 'code' => 'ELEC', 'is_active' => true]);
        $manager = $this->superAdmin();
        $officer = $this->officer($department, $village);
        $grievance = $this->grievance($village, $manager);
        Sanctum::actingAs($manager);
        $assignmentId = $this->postJson("/api/grievances/{$grievance->id}/assign", [
            'assigned_to' => $officer->id,
            'department_id' => $department->id,
            'instructions' => 'Inspect the failed transformer and restore supply.',
        ])->assertOk()->json('assignments.0.id');

        Sanctum::actingAs($officer);
        $this->postJson("/api/grievances/{$grievance->id}/assignments/{$assignmentId}/respond", [
            'action' => 'accept',
        ])->assertOk()->assertJsonPath('status', 'in_progress');

        $this->postJson("/api/grievances/{$grievance->id}/resolve", [
            'resolution_summary' => 'Too short',
        ])->assertUnprocessable()->assertJsonValidationErrors('resolution_summary');

        $this->postJson("/api/grievances/{$grievance->id}/resolve", [
            'resolution_summary' => 'Transformer repaired and electricity supply restored.',
            'public_remarks' => 'The field team verified normal supply at the complainant location.',
        ])->assertOk()->assertJsonPath('status', 'resolved');

        $this->postJson("/api/grievances/{$grievance->id}/close", [
            'citizen_confirmed' => true,
        ])->assertOk()->assertJsonPath('status', 'closed');

        $this->assertDatabaseHas('grievance_assignments', ['id' => $assignmentId, 'status' => 'completed']);
        $this->assertDatabaseHas('grievance_updates', ['grievance_id' => $grievance->id, 'update_type' => 'assignment_accepted']);
        $this->assertDatabaseHas('grievance_updates', ['grievance_id' => $grievance->id, 'update_type' => 'resolved']);
        $this->assertDatabaseHas('grievance_updates', ['grievance_id' => $grievance->id, 'update_type' => 'closed']);
    }

    public function test_only_assignee_can_respond_and_rejection_returns_case_to_pending(): void
    {
        [$village] = $this->villages();
        $department = Department::create(['name' => 'Sanitation', 'code' => 'SAN', 'is_active' => true]);
        $manager = $this->superAdmin();
        $officer = $this->officer($department, $village);
        $otherOfficer = $this->officer($department, $village);
        $grievance = $this->grievance($village, $manager);
        Sanctum::actingAs($manager);
        $assignmentId = $this->postJson("/api/grievances/{$grievance->id}/assign", [
            'assigned_to' => $officer->id,
            'department_id' => $department->id,
            'instructions' => 'Inspect and report.',
        ])->assertOk()->json('assignments.0.id');

        Sanctum::actingAs($otherOfficer);
        $this->postJson("/api/grievances/{$grievance->id}/assignments/{$assignmentId}/respond", [
            'action' => 'accept',
        ])->assertForbidden();

        Sanctum::actingAs($officer);
        $this->postJson("/api/grievances/{$grievance->id}/assignments/{$assignmentId}/respond", [
            'action' => 'reject',
            'rejection_reason' => 'This issue requires the health department rather than sanitation.',
        ])->assertOk()->assertJsonPath('status', 'pending');
        $this->assertNull($grievance->fresh()->assigned_to);
        $this->assertDatabaseHas('grievance_assignments', ['id' => $assignmentId, 'status' => 'rejected']);
    }

    public function test_linked_citizen_can_submit_feedback_and_reopen_only_their_own_grievance(): void
    {
        [$village] = $this->villages();
        $citizenRole = Role::create(['name' => 'Citizen', 'slug' => 'citizen', 'level' => 11, 'is_active' => true]);
        $citizen = Citizen::create([
            'unique_id' => 'CIT-FEEDBACK', 'first_name' => 'Anita', 'last_name' => 'Rao',
            'date_of_birth' => '1990-01-01', 'gender' => 'Female', 'mobile_number' => '9876543201',
        ]);
        $otherCitizen = Citizen::create([
            'unique_id' => 'CIT-OTHER-FEEDBACK', 'first_name' => 'Other', 'last_name' => 'Citizen',
            'date_of_birth' => '1991-01-01', 'gender' => 'Male', 'mobile_number' => '9876543202',
        ]);
        $user = User::factory()->create(['role_id' => $citizenRole->id, 'citizen_id' => $citizen->id]);
        $manager = $this->superAdmin();
        $own = $this->grievance($village, $manager);
        $own->update(['citizen_id' => $citizen->id, 'status' => 'closed', 'resolved_date' => today()]);
        $other = $this->grievance($village, $manager);
        $other->update(['citizen_id' => $otherCitizen->id, 'status' => 'closed', 'resolved_date' => today()]);
        Sanctum::actingAs($user);

        $this->getJson('/api/citizen/grievances')
            ->assertOk()
            ->assertJsonFragment(['id' => $own->id])
            ->assertJsonMissing(['id' => $other->id]);
        $this->postJson("/api/citizen/grievances/{$other->id}/feedback", [
            'rating' => 2, 'comments' => 'This should not be accepted.',
        ])->assertNotFound();

        $this->postJson("/api/citizen/grievances/{$own->id}/feedback", [
            'rating' => 2,
            'comments' => 'The reported issue remains unresolved at the location.',
            'reopen_requested' => true,
            'reopen_reason' => 'The repair was temporary and the same problem returned the next day.',
        ])->assertCreated()->assertJsonPath('feedback_type', 'reopen_request');

        $this->assertSame('in_progress', $own->fresh()->status);
        $this->assertDatabaseHas('grievance_feedback', [
            'grievance_id' => $own->id, 'citizen_id' => $citizen->id, 'rating' => 2,
        ]);
        $this->assertDatabaseHas('grievance_updates', [
            'grievance_id' => $own->id, 'update_type' => 'reopened_by_citizen',
        ]);
    }

    public function test_linked_citizen_files_a_grievance_with_server_derived_identity_location_and_sla(): void
    {
        [$village] = $this->villages();
        $department = Department::create(['name' => 'Civic Works', 'code' => 'CIV', 'is_active' => true]);
        $category = GrievanceCategory::create([
            'name' => 'Drainage', 'slug' => 'drainage', 'department_id' => $department->id,
            'sla_days' => 7, 'severity' => 'high', 'is_active' => true,
        ]);
        $role = Role::create(['name' => 'Citizen', 'slug' => 'citizen', 'level' => 11, 'is_active' => true]);
        $citizen = Citizen::create([
            'unique_id' => 'CIT-FILING', 'first_name' => 'Meera', 'last_name' => 'Singh',
            'date_of_birth' => '1988-02-03', 'gender' => 'Female',
            'mobile_number' => '9876543299', 'email' => 'meera@example.test',
        ]);
        CitizenAddress::create([
            'citizen_id' => $citizen->id, 'address_type' => 'residential',
            'village_id' => $village->id, 'is_primary' => true,
        ]);
        $user = User::factory()->create(['role_id' => $role->id, 'citizen_id' => $citizen->id]);
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/citizen/grievances', [
            'category_id' => $category->id,
            'subject' => 'Blocked drainage near the public school',
            'description' => 'The main drain has been blocked for several days and wastewater is entering the road.',
            'priority' => 'medium',
            'citizen_name' => 'Spoofed Name',
            'village_id' => fake()->uuid(),
        ])->assertCreated()
            ->assertJsonPath('status', 'pending');

        $this->assertDatabaseHas('grievances', [
            'id' => $response->json('id'),
            'citizen_id' => $citizen->id,
            'citizen_name' => 'Meera Singh',
            'citizen_mobile' => '9876543299',
            'village_id' => $village->id,
            'assigned_department_id' => $department->id,
            'source' => 'citizen_portal',
            'severity' => 'high',
        ]);
        $this->assertDatabaseHas('grievance_updates', [
            'grievance_id' => $response->json('id'),
            'update_type' => 'created',
            'is_public' => true,
        ]);
        $this->assertDatabaseHas('activity_logs', [
            'loggable_id' => $response->json('id'),
            'action' => 'citizen_grievance_filed',
        ]);
        $this->assertSame(today()->addDays(7)->toDateString(), $response->json('due_date'));
    }

    public function test_unlinked_citizen_account_cannot_file_a_grievance(): void
    {
        $role = Role::create(['name' => 'Citizen', 'slug' => 'citizen', 'level' => 11, 'is_active' => true]);
        $user = User::factory()->create(['role_id' => $role->id, 'citizen_id' => null]);
        Sanctum::actingAs($user);

        $this->postJson('/api/citizen/grievances', [
            'category_id' => fake()->uuid(),
            'subject' => 'A sufficiently long grievance subject',
            'description' => 'A sufficiently detailed grievance description for validation.',
            'priority' => 'medium',
        ])->assertStatus(409);
    }

    private function grievance(Village $village, User $creator): Grievance
    {
        $category = GrievanceCategory::create([
            'name' => 'Roads',
            'slug' => 'roads-'.fake()->unique()->word(),
            'sla_days' => 5,
            'is_active' => true,
        ]);

        return Grievance::create([
            'grievance_number' => 'GRV-'.fake()->unique()->numerify('####'),
            'category_id' => $category->id,
            'citizen_name' => 'Test Citizen',
            'citizen_mobile' => '9876543210',
            'subject' => 'Damaged road',
            'description' => 'The main road requires repair.',
            'village_id' => $village->id,
            'created_by' => $creator->id,
        ]);
    }

    private function superAdmin(): User
    {
        $role = Role::create(['name' => 'Super Admin', 'slug' => 'super-admin', 'level' => 1, 'is_active' => true]);
        return User::factory()->create(['role_id' => $role->id]);
    }

    private function officer(Department $department, Village $village): User
    {
        $permission = Permission::firstOrCreate(
            ['slug' => 'grievances.update'],
            ['name' => 'Update grievances', 'module' => 'grievances']
        );
        $role = Role::create([
            'name' => 'Officer '.fake()->unique()->word(),
            'slug' => 'officer-'.fake()->unique()->slug(),
            'level' => 6,
            'is_active' => true,
        ]);
        $role->permissions()->attach($permission);

        return User::factory()->create([
            'role_id' => $role->id,
            'department_id' => $department->id,
            'constituency_id' => $village->mandal->assemblyConstituency->constituency_id,
            'assembly_constituency_id' => $village->mandal->assembly_constituency_id,
            'mandal_id' => $village->mandal_id,
            'village_id' => $village->id,
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
        $firstMandal = Mandal::create([
            'name' => 'First Mandal',
            'code' => fake()->unique()->bothify('MD-###'),
            'assembly_constituency_id' => $assembly->id,
        ]);
        $secondMandal = Mandal::create([
            'name' => 'Second Mandal',
            'code' => fake()->unique()->bothify('MD-###'),
            'assembly_constituency_id' => $assembly->id,
        ]);

        return [
            Village::create(['name' => 'Village One', 'code' => fake()->unique()->bothify('V-###'), 'mandal_id' => $firstMandal->id]),
            Village::create(['name' => 'Village Two', 'code' => fake()->unique()->bothify('V-###'), 'mandal_id' => $secondMandal->id]),
        ];
    }
}
