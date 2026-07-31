<?php

namespace Tests\Feature\Documents;

use App\Models\Document;
use App\Models\DocumentCategory;
use App\Models\Project;
use App\Models\Role;
use App\Models\User;
use App\Models\Grievance;
use App\Models\GrievanceCategory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class DocumentVersionWorkflowTest extends TestCase
{
    use RefreshDatabase;

    public function test_authorized_user_can_upload_and_retain_private_document_versions(): void
    {
        Storage::fake('local');
        $user = $this->superAdmin();
        $project = $this->project($user);
        $category = DocumentCategory::create([
            'name' => 'Project Order',
            'slug' => 'project-order',
            'is_active' => true,
        ]);
        Sanctum::actingAs($user);

        $documentId = $this->postJson('/api/documents/upload', [
            'file' => UploadedFile::fake()->create('order.pdf', 100, 'application/pdf'),
            'title' => 'Sanction order',
            'document_category_id' => $category->id,
            'documentable_type' => 'project',
            'documentable_id' => $project->id,
        ])->assertCreated()->json('id');

        $document = Document::findOrFail($documentId);
        $initialPath = $document->file_path;
        Storage::disk('local')->assertExists($initialPath);
        $this->assertDatabaseHas('document_versions', [
            'document_id' => $document->id,
            'version_number' => 1,
            'is_current' => true,
        ]);

        $this->postJson("/api/documents/{$document->id}/versions", [
            'file' => UploadedFile::fake()->create('order-revised.pdf', 120, 'application/pdf'),
            'change_notes' => 'Corrected sanction amount and approval date.',
        ])->assertCreated()->assertJsonPath('version_number', 2);

        $document->refresh();
        Storage::disk('local')->assertExists($initialPath);
        Storage::disk('local')->assertExists($document->file_path);
        $this->getJson("/api/documents/{$document->id}/versions")
            ->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.version_number', 2)
            ->assertJsonPath('data.0.is_current', true);

        $this->deleteJson("/api/documents/{$document->id}")
            ->assertOk()
            ->assertJsonPath('message', 'Document archived successfully.');
        Storage::disk('local')->assertExists($initialPath);
        Storage::disk('local')->assertExists($document->file_path);
        $this->assertSoftDeleted('documents', ['id' => $document->id]);
    }

    public function test_version_upload_requires_change_notes_and_an_allowed_content_type(): void
    {
        Storage::fake('local');
        $user = $this->superAdmin();
        $document = Document::create([
            'document_number' => 'DOC-VALIDATION',
            'document_category_id' => DocumentCategory::create([
                'name' => 'General',
                'slug' => 'general',
                'is_active' => true,
            ])->id,
            'documentable_type' => Project::class,
            'documentable_id' => $this->project($user)->id,
            'title' => 'Existing document',
            'file_name' => 'existing.pdf',
            'file_path' => 'documents/existing.pdf',
            'storage_disk' => 'local',
            'created_by' => $user->id,
        ]);
        Sanctum::actingAs($user);

        $this->postJson("/api/documents/{$document->id}/versions", [
            'file' => UploadedFile::fake()->create('payload.exe', 20, 'application/x-msdownload'),
        ])->assertUnprocessable()
            ->assertJsonValidationErrors(['file', 'change_notes']);
    }

    public function test_grievance_can_own_a_private_document(): void
    {
        Storage::fake('local');
        $user = $this->superAdmin();
        $category = DocumentCategory::create(['name' => 'Evidence', 'slug' => 'evidence', 'is_active' => true]);
        $grievanceCategory = GrievanceCategory::create(['name' => 'Roads', 'slug' => 'roads', 'is_active' => true]);
        $grievance = Grievance::create([
            'grievance_number' => 'GRV-DOCUMENT',
            'category_id' => $grievanceCategory->id,
            'citizen_name' => 'Test Citizen',
            'citizen_mobile' => '9876543210',
            'subject' => 'Road damage',
            'description' => 'Evidence is attached.',
            'created_by' => $user->id,
        ]);
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/documents/upload', [
            'file' => UploadedFile::fake()->image('site.jpg'),
            'title' => 'Site evidence',
            'document_category_id' => $category->id,
            'documentable_type' => 'grievance',
            'documentable_id' => $grievance->id,
        ])->assertCreated();

        $this->assertDatabaseHas('documents', [
            'id' => $response->json('id'),
            'documentable_type' => Grievance::class,
            'documentable_id' => $grievance->id,
            'storage_disk' => 'local',
        ]);
    }

    private function superAdmin(): User
    {
        $role = Role::create([
            'name' => 'Super Admin',
            'slug' => 'super-admin',
            'level' => 1,
            'is_active' => true,
        ]);

        return User::factory()->create(['role_id' => $role->id]);
    }

    private function project(User $user): Project
    {
        return Project::create([
            'project_number' => 'PRJ-'.fake()->unique()->numerify('####'),
            'name' => 'Test Development Project',
            'project_type' => 'development',
            'category' => 'roads',
            'estimated_cost' => 100000,
            'created_by' => $user->id,
        ]);
    }
}
