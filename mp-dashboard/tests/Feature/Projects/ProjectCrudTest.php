<?php
namespace Tests\Feature\Projects;
use App\Models\AssemblyConstituency;use App\Models\Constituency;use App\Models\Mandal;use App\Models\Permission;use App\Models\Role;use App\Models\User;use App\Models\Village;use Illuminate\Foundation\Testing\RefreshDatabase;use Laravel\Sanctum\Sanctum;use Tests\TestCase;
class ProjectCrudTest extends TestCase { use RefreshDatabase;
 public function test_manager_can_create_a_project_and_server_derives_its_hierarchy():void {
  [$user,$constituency,$assembly,$mandal,$village]=$this->managerAndHierarchy();Sanctum::actingAs($user);
  $response=$this->postJson('/api/projects',['name'=>'Village water pipeline','project_type'=>'MPLADS','category'=>'Water','estimated_cost'=>1000000,'sanctioned_amount'=>900000,'village_id'=>$village->id,'status'=>'approved']);
  $response->assertCreated()->assertJsonPath('village_id',$village->id)->assertJsonPath('mandal_id',$mandal->id)->assertJsonPath('assembly_constituency_id',$assembly->id)->assertJsonPath('constituency_id',$constituency->id);
  $this->assertDatabaseHas('activity_logs',['loggable_id'=>$response->json('id'),'action'=>'created','module'=>'projects']);
 }
 public function test_manager_cannot_create_a_project_outside_assigned_village():void {
  [$user,,,$mandal]=$this->managerAndHierarchy();$outside=Village::create(['name'=>'Outside','code'=>'OUTSIDE','mandal_id'=>$mandal->id]);Sanctum::actingAs($user);
  $this->postJson('/api/projects',['name'=>'Outside project','project_type'=>'MPLADS','category'=>'Road','estimated_cost'=>1000,'village_id'=>$outside->id])->assertForbidden();
 }
 public function test_manager_can_record_and_filter_project_workflow_entries():void {
  [$user,,,, $village]=$this->managerAndHierarchy(); $project=\App\Models\Project::create(['project_number'=>'PRJ-WF','name'=>'Workflow project','project_type'=>'MPLADS','category'=>'Road','estimated_cost'=>10000,'village_id'=>$village->id]); Sanctum::actingAs($user);
  $created=$this->postJson('/api/projects/'.$project->id.'/workflow',['entry_type'=>'administrative_sanction','title'=>'Administrative sanction issued','status'=>'approved','reference_number'=>'AS-001','amount'=>9000,'entry_date'=>today()->toDateString()]); $created->assertCreated()->assertJsonPath('entry_type','administrative_sanction');
  $this->getJson('/api/projects/'.$project->id.'/workflow?entry_type=administrative_sanction')->assertOk()->assertJsonPath('meta.total',1);
 }
 public function test_manager_can_manage_project_lookup_and_duplicate_codes_are_rejected():void {
  [$user]=$this->managerAndHierarchy(); Sanctum::actingAs($user);
  $created=$this->postJson('/api/project-lookups/category',['name'=>'Roads','code'=>'ROADS'])->assertCreated();
  $this->postJson('/api/project-lookups/category',['name'=>'Other','code'=>'ROADS'])->assertStatus(422);
  $id=$created->json('id'); $this->deleteJson('/api/project-lookups/category/'.$id)->assertOk();
  $this->postJson('/api/project-lookups/category/'.$id.'/restore')->assertOk();
 }
 private function managerAndHierarchy():array {
  $role=Role::create(['name'=>'Constituency Coordinator','slug'=>'constituency-coordinator','level'=>3,'is_active'=>true]);$permission=Permission::create(['name'=>'Projects Manage','slug'=>'projects.manage','module'=>'projects']);$viewPermission=Permission::create(['name'=>'Projects View','slug'=>'projects.view','module'=>'projects']);$role->permissions()->attach([$permission->id,$viewPermission->id]);
  $constituency=Constituency::create(['name'=>'Test PC','code'=>'PC-PROJ','state'=>'Telangana','district'=>'Test']);$assembly=AssemblyConstituency::create(['name'=>'Test AC','code'=>'AC-PROJ','constituency_id'=>$constituency->id]);$mandal=Mandal::create(['name'=>'Test Mandal','code'=>'MAN-PROJ','assembly_constituency_id'=>$assembly->id]);$village=Village::create(['name'=>'Assigned','code'=>'ASSIGNED','mandal_id'=>$mandal->id]);$user=User::factory()->create(['role_id'=>$role->id,'village_id'=>$village->id]);return[$user,$constituency,$assembly,$mandal,$village];
 }
}
