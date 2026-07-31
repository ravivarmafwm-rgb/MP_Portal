<?php

namespace App\Jobs;

use App\Models\CommunicationRecipient;
use App\Services\CommunicationDeliveryService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Throwable;

class DeliverCommunicationRecipient implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    public int $tries=3; public array $backoff=[60,300,900];
    public function __construct(public string $recipientId){}
    public function handle(CommunicationDeliveryService $delivery):void{$recipient=CommunicationRecipient::with('campaign.template')->findOrFail($this->recipientId);if(!in_array($recipient->status,['pending','queued','failed','sending'],true))return;$recipient->update(['status'=>'sending','attempts'=>$recipient->attempts+1,'failure_reason'=>null]);try{$result=$delivery->deliver($recipient);$recipient->update(['status'=>'sent','provider_message_id'=>$result['provider_message_id'],'provider_response'=>$result['response'],'sent_at'=>now(),'failed_at'=>null]);$this->syncCampaign($recipient->campaign_id);}catch(Throwable $exception){$recipient->update(['status'=>'failed','failed_at'=>now(),'failure_reason'=>mb_substr($exception->getMessage(),0,2000)]);$this->syncCampaign($recipient->campaign_id);throw$exception;}}
    public function failed(Throwable $exception):void{$recipient=CommunicationRecipient::find($this->recipientId);if(!$recipient)return;$recipient->update(['status'=>'failed','failed_at'=>now(),'failure_reason'=>mb_substr($exception->getMessage(),0,2000)]);$this->syncCampaign($recipient->campaign_id);}
    private function syncCampaign(string $campaignId):void{$campaign=\App\Models\CommunicationCampaign::find($campaignId);if(!$campaign)return;$counts=CommunicationRecipient::where('campaign_id',$campaignId)->selectRaw("count(*) as total, count(*) filter (where status in ('sent','delivered')) as sent, count(*) filter (where status='delivered') as delivered, count(*) filter (where status='failed') as failed")->first();$campaign->update(['recipient_count'=>$counts->total,'sent_count'=>$counts->sent,'delivered_count'=>$counts->delivered,'failed_count'=>$counts->failed,'status'=>($counts->sent+$counts->failed)>=$counts->total?'completed':'sending','completed_at'=>($counts->sent+$counts->failed)>=$counts->total?now():null]);}
}
