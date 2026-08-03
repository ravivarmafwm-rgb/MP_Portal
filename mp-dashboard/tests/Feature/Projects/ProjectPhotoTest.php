<?php

namespace Tests\Feature\Projects;

use App\Models\AssemblyConstituency;
use App\Models\Constituency;
use App\Models\Mandal;
use App\Models\Permission;
use App\Models\Project;
use App\Models\Role;
use App\Models\User;
use App\Models\Village;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ProjectPhotoTest extends TestCase
{
    use RefreshDatabase;

    public function test_manager_can_upload_view_and_delete_a_private_project_photo(): void
    {
        Storage::fake('local');
        [$user, $project] = $this->managerAndProject();
        Sanctum::actingAs($user);

        $created = $this->post('/api/projects/'.$project->id.'/photos', [
            'photo' => UploadedFile::fake()->image('site.jpg', 1200, 800),
            'title' => 'Foundation work',
            'photo_date' => now()->toDateString(),
            'is_before' => true,
        ], ['Accept' => 'application/json']);

        $created->assertCreated()->assertJsonMissingPath('file_path');
        $photo = $project->photos()->firstOrFail();
        Storage::disk('local')->assertExists($photo->getRawOriginal('file_path'));
        $this->get('/api/projects/'.$project->id.'/photos/'.$photo->id)->assertOk();
        $this->deleteJson('/api/projects/'.$project->id.'/photos/'.$photo->id)->assertOk();
        Storage::disk('local')->assertMissing($photo->getRawOriginal('file_path'));
        $this->assertSoftDeleted('project_photos', ['id' => $photo->id]);
        $this->assertDatabaseHas('activity_logs', ['loggable_id' => $project->id, 'action' => 'photo_deleted']);
    }

    public function test_photo_id_cannot_be_used_with_a_different_project(): void
    {
        Storage::fake('local');
        [$user, $project, $village] = $this->managerAndProject();
        $other = Project::create(['project_number'=>'PRJ-OTHER','name'=>'Other','project_type'=>'MPLADS','category'=>'Road','estimated_cost'=>1000,'village_id'=>$village->id]);
        $photo = $project->photos()->create(['title'=>'Scoped','file_name'=>'x.jpg','file_path'=>'private/x.jpg','file_size'=>10,'photo_date'=>now(),'created_by'=>$user->id]);
        Sanctum::actingAs($user);
        $this->getJson('/api/projects/'.$other->id.'/photos/'.$photo->id)->assertNotFound();
        $this->deleteJson('/api/projects/'.$other->id.'/photos/'.$photo->id)->assertNotFound();
    }

    private function managerAndProject(): array
    {
        $role=Role::create(['name'=>'Constituency Coordinator','slug'=>'constituency-coordinator','level'=>3,'is_active'=>true]);
        foreach ([['Projects View','projects.view'],['Projects Manage','projects.manage']] as [$name,$slug]) $role->permissions()->attach(Permission::create(['name'=>$name,'slug'=>$slug,'module'=>'projects']));
        $constituency=Constituency::create(['name'=>'Test PC','code'=>'PC-PHOTO','state'=>'Andhra Pradesh','district'=>'Test']);
        $assembly=AssemblyConstituency::create(['name'=>'Test AC','code'=>'AC-PHOTO','constituency_id'=>$constituency->id]);
        $mandal=Mandal::create(['name'=>'Test Mandal','code'=>'MAN-PHOTO','assembly_constituency_id'=>$assembly->id]);
        $village=Village::create(['name'=>'Assigned','code'=>'PHOTO-V','mandal_id'=>$mandal->id]);
        $user=User::factory()->create(['role_id'=>$role->id,'village_id'=>$village->id]);
        $project=Project::create(['project_number'=>'PRJ-PHOTO','name'=>'Photo project','project_type'=>'MPLADS','category'=>'Water','estimated_cost'=>100000,'village_id'=>$village->id,'created_by'=>$user->id]);
        return [$user,$project,$village];
    }
}
