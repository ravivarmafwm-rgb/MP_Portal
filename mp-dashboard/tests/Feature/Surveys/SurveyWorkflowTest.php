<?php
namespace Tests\Feature\Surveys;
use App\Models\AssemblyConstituency;use App\Models\Constituency;use App\Models\Mandal;use App\Models\Permission;use App\Models\Role;use App\Models\User;use App\Models\Village;use App\Models\Volunteer;use Illuminate\Foundation\Testing\RefreshDatabase;use Laravel\Sanctum\Sanctum;use Tests\TestCase;
class SurveyWorkflowTest extends TestCase
{
 use RefreshDatabase;
 public function test_manager_can_build_publish_and_submit_a_valid_survey():void
 {
  [$user,$village]=$this->manager();Sanctum::actingAs($user);$created=$this->postJson('/api/surveys',$this->payload($village->id));$created->assertCreated()->assertJsonCount(2,'questions')->assertJsonPath('status','draft');$id=$created->json('id');$this->postJson("/api/surveys/{$id}/publish")->assertOk()->assertJsonPath('status','active');$survey=$this->getJson("/api/surveys/{$id}")->json();$answers=collect($survey['questions'])->mapWithKeys(fn($question)=>[$question['id']=>$question['question_type']==='number'?4:'Clean drinking water'])->all();$this->postJson("/api/surveys/{$id}/responses",['respondent_name'=>'Test Person','respondent_mobile'=>'9876543210','village_id'=>$village->id,'answers'=>$answers])->assertCreated();$this->assertDatabaseHas('surveys',['id'=>$id,'total_responses'=>1]);$this->assertDatabaseCount('survey_response_details',2);$this->assertDatabaseHas('activity_logs',['module'=>'surveys','action'=>'submitted']);
 }
 public function test_required_dynamic_answer_is_enforced():void
 {
  [$user,$village]=$this->manager();Sanctum::actingAs($user);$id=$this->postJson('/api/surveys',$this->payload($village->id))->json('id');$this->postJson("/api/surveys/{$id}/publish");$this->postJson("/api/surveys/{$id}/responses",['village_id'=>$village->id,'answers'=>[]])->assertUnprocessable();$this->assertDatabaseCount('survey_responses',0);
 }
 public function test_manager_can_assign_an_in_scope_volunteer():void
 {
  [$user,$village]=$this->manager();$volunteer=Volunteer::create(['volunteer_id'=>'VOL-SUR-1','first_name'=>'Field','last_name'=>'Worker','date_of_birth'=>'1995-01-01','gender'=>'male','mobile_number'=>'9876543210','village_id'=>$village->id,'joining_date'=>now()->toDateString(),'status'=>'active']);Sanctum::actingAs($user);$id=$this->postJson('/api/surveys',$this->payload($village->id))->json('id');$this->postJson("/api/surveys/{$id}/assignments",['volunteer_ids'=>[$volunteer->id],'target_responses'=>25,'due_date'=>now()->addWeek()->toDateString()])->assertOk()->assertJsonPath('volunteer_count',1);$this->assertDatabaseHas('survey_assignments',['survey_id'=>$id,'volunteer_id'=>$volunteer->id,'target_responses'=>25]);
 }
 public function test_question_analytics_are_calculated_from_submitted_answers():void
 {
  [$user,$village]=$this->manager();Sanctum::actingAs($user);$id=$this->postJson('/api/surveys',$this->payload($village->id))->json('id');$this->postJson("/api/surveys/{$id}/publish");$questions=$this->getJson("/api/surveys/{$id}")->json('questions');$this->postJson("/api/surveys/{$id}/responses",['village_id'=>$village->id,'answers'=>[$questions[0]['id']=>'Water shortage',$questions[1]['id']=>4]])->assertCreated();$this->getJson("/api/surveys/{$id}/analytics")->assertOk()->assertJsonPath('total_responses',1)->assertJsonPath('questions.1.average',4);
 }
 public function test_offline_retry_is_idempotent():void
 {
  [$user,$village]=$this->manager();Sanctum::actingAs($user);$id=$this->postJson('/api/surveys',$this->payload($village->id))->json('id');$this->postJson("/api/surveys/{$id}/publish");$questions=$this->getJson("/api/surveys/{$id}")->json('questions');$submission=(string)\Illuminate\Support\Str::uuid();$payload=['client_submission_id'=>$submission,'collected_at'=>now()->toIso8601String(),'submitted_offline'=>true,'village_id'=>$village->id,'answers'=>[$questions[0]['id']=>'Water shortage',$questions[1]['id']=>3]];$first=$this->postJson("/api/surveys/{$id}/responses",$payload)->assertCreated();$this->postJson("/api/surveys/{$id}/responses",$payload)->assertCreated()->assertJsonPath('id',$first->json('id'));$this->assertDatabaseCount('survey_responses',1);$this->assertDatabaseHas('survey_responses',['client_submission_id'=>$submission,'submitted_offline'=>true]);
 }
 private function payload(string $villageId):array{return['title'=>'Water access survey','description'=>'Household water access','category'=>'water','start_date'=>now()->toDateString(),'end_date'=>now()->addMonth()->toDateString(),'target_responses'=>100,'require_authentication'=>false,'language'=>'en','village_id'=>$villageId,'questions'=>[['question_text'=>'Primary water issue','question_type'=>'short_text','options'=>null,'is_required'=>true],['question_text'=>'Severity','question_type'=>'number','options'=>null,'is_required'=>true]]];}
 private function manager():array{$role=Role::create(['name'=>'Constituency Coordinator','slug'=>'constituency-coordinator','level'=>3,'is_active'=>true]);foreach([['Surveys View','surveys.view'],['Surveys Manage','surveys.manage'],['Surveys Submit','surveys.submit'],['Locations View','locations.view']]as[$name,$slug])$role->permissions()->attach(Permission::create(['name'=>$name,'slug'=>$slug,'module'=>explode('.',$slug)[0]]));$pc=Constituency::create(['name'=>'Survey PC','code'=>'SUR-PC','state'=>'Telangana','district'=>'Test']);$ac=AssemblyConstituency::create(['name'=>'Survey AC','code'=>'SUR-AC','constituency_id'=>$pc->id]);$mandal=Mandal::create(['name'=>'Survey Mandal','code'=>'SUR-M','assembly_constituency_id'=>$ac->id]);$village=Village::create(['name'=>'Survey Village','code'=>'SUR-V','mandal_id'=>$mandal->id]);$user=User::factory()->create(['role_id'=>$role->id,'village_id'=>$village->id]);return[$user,$village];}
}
