<?php

namespace Tests\Feature\Schemes;

use App\Models\AssemblyConstituency;
use App\Models\Citizen;
use App\Models\CitizenAddress;
use App\Models\Constituency;
use App\Models\Mandal;
use App\Models\Role;
use App\Models\Permission;
use App\Models\Scheme;
use App\Models\SchemeEligibilityRule;
use App\Models\User;
use App\Models\Village;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use App\Models\DocumentCategory;
use App\Models\SchemeRequiredDocument;
use App\Models\Family;
use App\Models\FamilyMember;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class SchemeApplicationWorkflowTest extends TestCase
{
    use RefreshDatabase;

    public function test_volunteer_can_submit_for_scoped_citizen_and_official_can_return_pending_with_reason(): void
    {
        $village = $this->village();
        $volunteerRole = Role::create(['name' => 'Volunteer', 'slug' => 'volunteer', 'level' => 9, 'is_active' => true]);
        $permission = Permission::create(['name' => 'Apply schemes', 'slug' => 'schemes.apply', 'module' => 'schemes']);
        $volunteerRole->permissions()->attach($permission);
        $officialRole = Role::create(['name' => 'Super Admin', 'slug' => 'super-admin', 'level' => 1, 'is_active' => true]);
        $citizen = Citizen::create(['unique_id' => 'CIT-ASSIST-1', 'first_name' => 'Assisted', 'last_name' => 'Citizen', 'date_of_birth' => today()->subYears(35), 'gender' => 'Female', 'mobile_number' => '9876500011']);
        CitizenAddress::create(['citizen_id' => $citizen->id, 'address_type' => 'residential', 'village_id' => $village->id, 'is_primary' => true]);
        $scheme = Scheme::create(['name' => 'Assisted Welfare', 'code' => 'ASSIST-1', 'category' => 'welfare', 'start_date' => today()->subDay(), 'is_active' => true]);
        $volunteer = User::factory()->create(['role_id' => $volunteerRole->id, 'village_id' => $village->id]);
        Sanctum::actingAs($volunteer);
        $applicationId = $this->postJson('/api/schemes/applications/assisted', ['target_citizen_id' => $citizen->id, 'scheme_id' => $scheme->id])->assertCreated()->assertJsonPath('application_source', 'volunteer')->json('id');
        $this->assertDatabaseHas('scheme_applications', ['id' => $applicationId, 'submitted_by' => $volunteer->id, 'application_source' => 'volunteer']);
        Sanctum::actingAs(User::factory()->create(['role_id' => $officialRole->id]));
        $this->postJson("/api/schemes/applications/{$applicationId}/review", ['action' => 'start_review'])->assertOk()->assertJsonPath('status', 'under_review');
        $this->postJson("/api/schemes/applications/{$applicationId}/review", ['action' => 'mark_pending', 'pending_reason' => 'Please confirm the latest income certificate.'])->assertOk()->assertJsonPath('status', 'pending');
        $this->assertDatabaseHas('scheme_applications', ['id' => $applicationId, 'pending_reason' => 'Please confirm the latest income certificate.']);
    }

    public function test_linked_citizen_submits_and_staff_reviews_and_approves_an_eligible_application(): void
    {
        $village = $this->village();
        $citizenRole = Role::create(['name' => 'Citizen', 'slug' => 'citizen', 'level' => 11, 'is_active' => true]);
        $adminRole = Role::create(['name' => 'Super Admin', 'slug' => 'super-admin', 'level' => 1, 'is_active' => true]);
        $citizen = Citizen::create([
            'unique_id' => 'CIT-SCHEME-1', 'first_name' => 'Asha', 'last_name' => 'Devi',
            'date_of_birth' => today()->subYears(65), 'gender' => 'Female',
            'mobile_number' => '9876500001',
        ]);
        CitizenAddress::create([
            'citizen_id' => $citizen->id, 'address_type' => 'residential',
            'village_id' => $village->id, 'is_primary' => true,
        ]);
        $citizenUser = User::factory()->create(['role_id' => $citizenRole->id, 'citizen_id' => $citizen->id]);
        $admin = User::factory()->create(['role_id' => $adminRole->id]);
        $scheme = Scheme::create([
            'name' => 'Senior Support', 'code' => 'SENIOR-1', 'category' => 'pension',
            'start_date' => today()->subDay(), 'end_date' => today()->addYear(),
            'max_amount' => 25000, 'is_active' => true,
        ]);
        SchemeEligibilityRule::create([
            'scheme_id' => $scheme->id, 'rule_name' => 'Minimum age',
            'rule_type' => 'demographic', 'field_name' => 'age',
            'operator' => 'greater_than_or_equal', 'value' => '60', 'is_mandatory' => true,
        ]);
        $documentCategory = DocumentCategory::create([
            'name' => 'Identity Proof', 'slug' => 'identity-proof', 'is_active' => true,
        ]);
        $requirement = SchemeRequiredDocument::create([
            'scheme_id' => $scheme->id, 'document_category_id' => $documentCategory->id,
            'name' => 'Age proof', 'is_mandatory' => true, 'max_age_days' => 3650,
            'is_active' => true,
        ]);
        Sanctum::actingAs($citizenUser);

        $applicationId = $this->postJson('/api/citizen/scheme-applications', [
            'scheme_id' => $scheme->id, 'remarks' => 'Applying using my verified profile.',
            'applicant_name' => 'Spoofed Applicant',
        ])->assertCreated()
            ->assertJsonPath('status', 'submitted')
            ->json('id');

        $this->assertDatabaseHas('scheme_applications', [
            'id' => $applicationId, 'citizen_id' => $citizen->id,
            'applicant_name' => 'Asha Devi', 'village_id' => $village->id,
        ]);
        Storage::fake('local');
        $otherCitizen = Citizen::create([
            'unique_id' => 'CIT-SCHEME-OTHER', 'first_name' => 'Other', 'last_name' => 'Citizen',
            'date_of_birth' => today()->subYears(70), 'gender' => 'Female',
            'mobile_number' => '9876500099',
        ]);
        $otherUser = User::factory()->create(['role_id' => $citizenRole->id, 'citizen_id' => $otherCitizen->id]);
        Sanctum::actingAs($otherUser);
        $this->postJson("/api/citizen/scheme-applications/{$applicationId}/documents", [
            'requirement_id' => $requirement->id, 'document_date' => today()->toDateString(),
            'file' => UploadedFile::fake()->create('other.pdf', 10, 'application/pdf'),
        ])->assertForbidden();
        $this->postJson("/api/citizen/scheme-applications/{$applicationId}/withdraw", [
            'reason' => 'Trying to withdraw another citizen application.',
        ])->assertForbidden();
        Sanctum::actingAs($citizenUser);
        $uploadedReview = $this->postJson("/api/citizen/scheme-applications/{$applicationId}/documents", [
            'requirement_id' => $requirement->id,
            'document_date' => today()->subYear()->toDateString(),
            'file' => UploadedFile::fake()->create('age-proof.pdf', 120, 'application/pdf'),
        ])->assertCreated()
            ->assertJsonPath('status', 'pending')
            ->json();
        $reviewId = $uploadedReview['id'];
        $this->get("/api/documents/{$uploadedReview['document']['id']}/download")->assertOk();
        $this->assertDatabaseHas('documents', [
            'documentable_id' => $applicationId, 'is_confidential' => true,
            'is_verified' => false,
        ]);
        Sanctum::actingAs($admin);
        $this->postJson("/api/schemes/applications/{$applicationId}/review", [
            'action' => 'start_review', 'remarks' => 'Documents verified.',
        ])->assertOk()->assertJsonPath('status', 'under_review');
        $this->postJson("/api/schemes/applications/{$applicationId}/review", [
            'action' => 'approve', 'sanctioned_amount' => 12000,
            'sanction_order_number' => 'BLOCKED-UNTIL-VERIFIED',
        ])->assertUnprocessable();
        $this->postJson("/api/schemes/application-document-reviews/{$reviewId}", [
            'action' => 'verify',
        ])->assertOk()->assertJsonPath('status', 'verified');
        $this->postJson("/api/schemes/applications/{$applicationId}/review", [
            'action' => 'approve', 'sanctioned_amount' => 12000,
            'sanction_order_number' => 'ORDER-2026-001',
        ])->assertOk()->assertJsonPath('status', 'approved');

        $this->assertDatabaseHas('scheme_beneficiaries', [
            'application_id' => $applicationId, 'citizen_id' => $citizen->id,
        ]);
        $this->assertDatabaseHas('activity_logs', [
            'loggable_id' => $applicationId, 'action' => 'application_approved',
        ]);

        $disbursement = $this->postJson("/api/schemes/applications/{$applicationId}/disbursements", [
            'amount' => 12000, 'payment_mode' => 'bank_transfer',
            'disbursement_date' => today()->toDateString(), 'bank_name' => 'Public Bank',
            'account_number' => '123456789012', 'ifsc_code' => 'ABCD0123456',
            'reference_number' => 'PAYMENT-BATCH-1',
        ])->assertCreated()
            ->assertJsonPath('status', 'pending')
            ->assertJsonPath('account_number_masked', 'XXXXXXXX9012')
            ->assertJsonMissingPath('account_ciphertext')
            ->json();

        $stored = \App\Models\BenefitDisbursement::findOrFail($disbursement['id']);
        $this->assertNull($stored->getRawOriginal('account_number'));
        $this->assertNotNull($stored->getRawOriginal('account_ciphertext'));
        $this->postJson("/api/schemes/disbursements/{$stored->id}/transition", [
            'action' => 'complete', 'transaction_id' => 'TXN-SCHEME-0001',
        ])->assertOk()->assertJsonPath('status', 'completed');
        $this->assertDatabaseHas('scheme_beneficiaries', [
            'application_id' => $applicationId,
            'total_benefit_received' => 12000,
            'benefit_count' => 1,
        ]);
        $this->assertDatabaseHas('scheme_applications', [
            'id' => $applicationId, 'payment_status' => 'paid',
        ]);
        Sanctum::actingAs($citizenUser);
        $this->postJson("/api/citizen/scheme-applications/{$applicationId}/withdraw", [
            'reason' => 'This approved and paid application must remain immutable.',
        ])->assertUnprocessable();
        $withdrawable = \App\Models\SchemeApplication::create([
            'application_number' => 'SCH-WITHDRAW-1', 'scheme_id' => $scheme->id,
            'citizen_id' => $citizen->id, 'applicant_name' => 'Asha Devi',
            'applicant_mobile' => $citizen->mobile_number, 'village_id' => $village->id,
            'status' => 'submitted', 'application_date' => today(), 'created_by' => $citizenUser->id,
        ]);
        $this->postJson("/api/citizen/scheme-applications/{$withdrawable->id}/withdraw", [
            'reason' => 'I no longer wish to continue with this application.',
        ])->assertOk()->assertJsonPath('status', 'withdrawn');
        $this->assertDatabaseHas('activity_logs', [
            'loggable_id' => $withdrawable->id, 'action' => 'application_withdrawn',
        ]);
    }

    public function test_ineligible_citizen_and_invalid_state_transition_are_rejected(): void
    {
        $village = $this->village();
        $citizenRole = Role::create(['name' => 'Citizen', 'slug' => 'citizen', 'level' => 11, 'is_active' => true]);
        $adminRole = Role::create(['name' => 'Super Admin', 'slug' => 'super-admin', 'level' => 1, 'is_active' => true]);
        $citizen = Citizen::create([
            'unique_id' => 'CIT-SCHEME-2', 'first_name' => 'Young', 'last_name' => 'Applicant',
            'date_of_birth' => today()->subYears(25), 'gender' => 'Male',
            'mobile_number' => '9876500002',
        ]);
        CitizenAddress::create([
            'citizen_id' => $citizen->id, 'address_type' => 'residential',
            'village_id' => $village->id, 'is_primary' => true,
        ]);
        $user = User::factory()->create(['role_id' => $citizenRole->id, 'citizen_id' => $citizen->id]);
        $scheme = Scheme::create([
            'name' => 'Senior Pension', 'code' => 'SENIOR-2', 'category' => 'pension',
            'start_date' => today()->subDay(), 'is_active' => true,
        ]);
        SchemeEligibilityRule::create([
            'scheme_id' => $scheme->id, 'rule_name' => 'Minimum age',
            'rule_type' => 'demographic', 'field_name' => 'age',
            'operator' => '>=', 'value' => '60', 'is_mandatory' => true,
        ]);
        Sanctum::actingAs($user);
        $this->postJson('/api/citizen/scheme-applications', ['scheme_id' => $scheme->id])
            ->assertUnprocessable();
        $this->assertDatabaseCount('scheme_applications', 0);

        $scheme->eligibilityRules()->delete();
        $applicationId = $this->postJson('/api/citizen/scheme-applications', ['scheme_id' => $scheme->id])
            ->assertCreated()->json('id');
        Sanctum::actingAs(User::factory()->create(['role_id' => $adminRole->id]));
        $this->postJson("/api/schemes/applications/{$applicationId}/review", [
            'action' => 'approve', 'sanctioned_amount' => 1000,
            'sanction_order_number' => 'INVALID-DIRECT',
        ])->assertUnprocessable();

        $this->postJson("/api/schemes/applications/{$applicationId}/review", [
            'action' => 'start_review',
        ])->assertOk();
        $this->postJson("/api/schemes/applications/{$applicationId}/review", [
            'action' => 'approve', 'sanctioned_amount' => 1000,
            'sanction_order_number' => 'VALID-AFTER-REVIEW',
        ])->assertOk();
        $disbursementId = $this->postJson("/api/schemes/applications/{$applicationId}/disbursements", [
            'amount' => 1000, 'payment_mode' => 'cash',
            'disbursement_date' => today()->toDateString(),
        ])->assertCreated()->json('id');
        $this->postJson("/api/schemes/disbursements/{$disbursementId}/transition", [
            'action' => 'fail', 'failure_reason' => 'Citizen could not collect the scheduled payment.',
        ])->assertOk()->assertJsonPath('status', 'failed');
        $this->postJson("/api/schemes/disbursements/{$disbursementId}/transition", [
            'action' => 'retry', 'retry_date' => today()->addDay()->toDateString(),
        ])->assertOk()->assertJsonPath('status', 'pending')->assertJsonPath('retry_count', 1);
        $this->postJson("/api/schemes/disbursements/{$disbursementId}/transition", [
            'action' => 'complete', 'transaction_id' => 'CASH-RECEIPT-001',
        ])->assertOk()->assertJsonPath('status', 'completed');

        $this->postJson("/api/schemes/{$scheme->id}/eligibility-rules", [
            'rule_name' => 'Invalid comparison', 'field_name' => 'gender',
            'operator' => 'greater_than_or_equal', 'value' => 'Female',
            'is_mandatory' => true, 'error_message' => 'Gender requirement is not satisfied.',
        ])->assertUnprocessable()->assertJsonValidationErrors('operator');
        $ruleId = $this->postJson("/api/schemes/{$scheme->id}/eligibility-rules", [
            'rule_name' => 'Eligible gender', 'field_name' => 'gender',
            'operator' => 'equals', 'value' => 'Male', 'sort_order' => 1,
            'is_mandatory' => true, 'error_message' => 'This scheme is currently available to male citizens.',
        ])->assertCreated()->json('id');
        $this->putJson("/api/schemes/{$scheme->id}/eligibility-rules/{$ruleId}", [
            'rule_name' => 'Eligible genders', 'field_name' => 'gender',
            'operator' => 'in', 'value' => 'Male,Female', 'sort_order' => 1,
            'is_mandatory' => true, 'error_message' => 'The recorded gender is not eligible for this scheme.',
        ])->assertOk()->assertJsonPath('operator', 'in');
        $this->deleteJson("/api/schemes/{$scheme->id}/eligibility-rules/{$ruleId}")
            ->assertNoContent();

        $catalogId = $this->postJson('/api/schemes', [
            'name' => 'Catalog Managed Scheme', 'code' => 'CATALOG-1',
            'category' => 'welfare', 'start_date' => today()->toDateString(),
            'application_mode' => 'online', 'sla_days' => 20, 'is_active' => true,
        ])->assertCreated()->assertJsonPath('code', 'CATALOG-1')->json('id');
        $this->putJson("/api/schemes/{$catalogId}", [
            'is_active' => false, 'remarks' => 'Temporarily closed for applications.',
        ])->assertOk()->assertJsonPath('is_active', false);
        $this->deleteJson("/api/schemes/{$catalogId}")->assertNoContent();
        $this->assertSoftDeleted('schemes', ['id' => $catalogId]);
    }

    public function test_family_head_can_apply_for_member_and_official_rejection_is_attributed(): void
    {
        $village = $this->village();
        $citizenRole = Role::create(['name' => 'Citizen', 'slug' => 'citizen', 'level' => 11, 'is_active' => true]);
        $officialRole = Role::create(['name' => 'Super Admin', 'slug' => 'super-admin', 'level' => 1, 'is_active' => true]);
        $head = Citizen::create([
            'unique_id' => 'CIT-HEAD-1', 'first_name' => 'Family', 'last_name' => 'Head',
            'date_of_birth' => today()->subYears(45), 'gender' => 'Male', 'mobile_number' => '9876500015',
        ]);
        $member = Citizen::create([
            'unique_id' => 'CIT-MEMBER-1', 'first_name' => 'Family', 'last_name' => 'Member',
            'date_of_birth' => today()->subYears(20), 'gender' => 'Female', 'mobile_number' => '9876500016',
        ]);
        CitizenAddress::create(['citizen_id' => $head->id, 'address_type' => 'residential', 'village_id' => $village->id, 'is_primary' => true]);
        CitizenAddress::create(['citizen_id' => $member->id, 'address_type' => 'residential', 'village_id' => $village->id, 'is_primary' => true]);
        $family = Family::create([
            'family_id' => 'FAM-SCHEME-1', 'head_citizen_id' => $head->id, 'village_id' => $village->id,
            'head_of_family_name' => 'Family Head', 'members_count' => 2, 'voters_count' => 2,
            'economic_status' => 'middle', 'is_bpl' => false,
        ]);
        $head->update(['family_id' => $family->id, 'relationship_to_head' => 'Self']);
        $member->update(['family_id' => $family->id, 'relationship_to_head' => 'Daughter']);
        FamilyMember::create(['family_id' => $family->id, 'citizen_id' => $head->id, 'relationship_with_head' => 'Self', 'is_head' => true, 'date_of_joining_family' => today()]);
        FamilyMember::create(['family_id' => $family->id, 'citizen_id' => $member->id, 'relationship_with_head' => 'Daughter', 'is_head' => false, 'date_of_joining_family' => today()]);
        $citizenUser = User::factory()->create(['role_id' => $citizenRole->id, 'citizen_id' => $head->id]);
        $official = User::factory()->create(['role_id' => $officialRole->id]);
        $scheme = Scheme::create([
            'name' => 'Family Assistance', 'code' => 'FAMILY-1', 'category' => 'welfare',
            'start_date' => today()->subDay(), 'is_active' => true,
        ]);

        Sanctum::actingAs($citizenUser);
        $applicationId = $this->postJson('/api/citizen/scheme-applications', [
            'scheme_id' => $scheme->id, 'target_citizen_id' => $member->id,
        ])->assertCreated()->assertJsonPath('citizen_id', $member->id)->json('id');

        Sanctum::actingAs($official);
        $this->postJson("/api/schemes/applications/{$applicationId}/review", [
            'action' => 'start_review',
        ])->assertOk()->assertJsonPath('processed_by.id', $official->id);
        $this->postJson("/api/schemes/applications/{$applicationId}/review", [
            'action' => 'reject',
            'rejection_reason' => 'The submitted household income evidence does not meet the scheme threshold.',
        ])->assertOk()->assertJsonPath('status', 'rejected')->assertJsonPath('processed_by.id', $official->id);

        $this->assertDatabaseHas('scheme_applications', [
            'id' => $applicationId, 'family_id' => $family->id, 'citizen_id' => $member->id,
            'processed_by' => $official->id,
            'rejection_reason' => 'The submitted household income evidence does not meet the scheme threshold.',
        ]);
        $this->assertDatabaseHas('activity_logs', [
            'loggable_id' => $applicationId, 'action' => 'application_rejected', 'user_id' => $official->id,
        ]);
    }

    private function village(): Village
    {
        $constituency = Constituency::create([
            'name' => 'Scheme Constituency', 'code' => fake()->unique()->bothify('SC-###'),
            'state' => 'Test State', 'district' => 'Test District',
        ]);
        $assembly = AssemblyConstituency::create([
            'name' => 'Scheme Assembly', 'code' => fake()->unique()->bothify('SA-###'),
            'constituency_id' => $constituency->id,
        ]);
        $mandal = Mandal::create([
            'name' => 'Scheme Mandal', 'code' => fake()->unique()->bothify('SM-###'),
            'assembly_constituency_id' => $assembly->id,
        ]);
        return Village::create([
            'name' => 'Scheme Village', 'code' => fake()->unique()->bothify('SV-###'),
            'mandal_id' => $mandal->id,
        ]);
    }
}
