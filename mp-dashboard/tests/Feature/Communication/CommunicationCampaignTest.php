<?php

namespace Tests\Feature\Communication;

use App\Jobs\DeliverCommunicationRecipient;
use App\Models\Citizen;
use App\Models\CommunicationCampaign;
use App\Models\CommunicationConsent;
use App\Models\CommunicationTemplate;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CommunicationCampaignTest extends TestCase
{
    use RefreshDatabase;

    public function test_dispatch_only_queues_recipients_with_explicit_matching_consent(): void
    {
        Queue::fake(); [$user,$campaign,$citizen]=$this->fixture(); Sanctum::actingAs($user);
        $this->postJson("/api/communications/campaigns/{$campaign->id}/dispatch")->assertUnprocessable()->assertJsonValidationErrors('audience');
        CommunicationConsent::create(['contact_type'=>'citizen','contact_id'=>$citizen->id,'channel'=>'sms','purpose'=>'general','is_granted'=>true,'granted_at'=>now(),'source'=>'written','proof_reference'=>'CONSENT-001','recorded_by'=>$user->id]);
        $this->postJson("/api/communications/campaigns/{$campaign->id}/dispatch")->assertOk()->assertJsonPath('recipient_count',1);
        $recipient=$campaign->recipients()->firstOrFail();$this->assertSame('queued',$recipient->status);$this->assertSame($citizen->mobile_number,$recipient->destination);$this->assertNotSame($citizen->mobile_number,$recipient->getRawOriginal('destination'));
        Queue::assertPushed(DeliverCommunicationRecipient::class,fn($job)=>$job->recipientId===$recipient->id);
    }

    public function test_revoked_consent_is_never_selected(): void
    {
        Queue::fake(); [$user,$campaign,$citizen]=$this->fixture(); CommunicationConsent::create(['contact_type'=>'citizen','contact_id'=>$citizen->id,'channel'=>'sms','purpose'=>'general','is_granted'=>false,'revoked_at'=>now(),'source'=>'written','proof_reference'=>'REVOKED-001','recorded_by'=>$user->id]); Sanctum::actingAs($user);
        $this->postJson("/api/communications/campaigns/{$campaign->id}/dispatch")->assertUnprocessable(); Queue::assertNothingPushed();
    }

    private function fixture(): array
    {
        $role=Role::create(['name'=>'MP Staff','slug'=>'mp-staff','level'=>2,'is_active'=>true]);foreach([['Communications View','communications.view'],['Communications Manage','communications.manage'],['Communications Approve','communications.approve']] as[$name,$slug])$role->permissions()->attach(Permission::create(['name'=>$name,'slug'=>$slug,'module'=>'communications']));$user=User::factory()->create(['role_id'=>$role->id]);$citizen=Citizen::create(['unique_id'=>'C-COMM-1','first_name'=>'Asha','last_name'=>'Rao','date_of_birth'=>'1990-01-01','gender'=>'female','mobile_number'=>'919876543210']);$template=CommunicationTemplate::create(['name'=>'DLT General','channel'=>'sms','purpose'=>'general','body'=>'Hello {{name}}','dlt_entity_id'=>'ENTITY','dlt_template_id'=>'DLT-001','status'=>'approved','is_active'=>true,'created_by'=>$user->id]);$campaign=CommunicationCampaign::create(['campaign_number'=>'COM-TEST-1','name'=>'Test SMS','channel'=>'sms','purpose'=>'general','template_id'=>$template->id,'body'=>$template->body,'audience_filters'=>['type'=>'citizens'],'status'=>'approved','created_by'=>$user->id,'approved_by'=>$user->id,'approved_at'=>now()]);return[$user,$campaign,$citizen];
    }
}
