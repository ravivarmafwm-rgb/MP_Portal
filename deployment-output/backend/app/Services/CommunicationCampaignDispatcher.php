<?php
namespace App\Services;
use App\Jobs\DeliverCommunicationRecipient;use App\Models\CommunicationCampaign;use App\Models\CommunicationRecipient;use Illuminate\Support\Facades\DB;use Illuminate\Validation\ValidationException;
class CommunicationCampaignDispatcher
{
 public function __construct(private CommunicationAudienceService $audience){}
 public function dispatch(CommunicationCampaign $campaign):int{$count=DB::transaction(function()use($campaign){$recipients=$this->audience->resolve($campaign);if($recipients->isEmpty())throw ValidationException::withMessages(['audience'=>['No consented recipients with a valid destination match this campaign.']]);foreach($recipients as $recipient)CommunicationRecipient::updateOrCreate(['campaign_id'=>$campaign->id,'contact_type'=>$recipient['type'],'contact_id'=>$recipient['id']],['destination'=>$recipient['destination'],'variables'=>$recipient['variables'],'status'=>'queued','queued_at'=>now()]);$campaign->update(['status'=>'sending','started_at'=>now(),'recipient_count'=>$recipients->count()]);return$recipients->count();});CommunicationRecipient::where('campaign_id',$campaign->id)->where('status','queued')->pluck('id')->each(fn($id)=>DeliverCommunicationRecipient::dispatch($id)->onQueue('communications'));return$count;}
}
