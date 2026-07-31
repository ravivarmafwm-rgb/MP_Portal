<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CommunicationCampaign;
use App\Models\CommunicationRecipient;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class CommunicationWebhookController extends Controller
{
    public function verifyWhatsApp(Request $request): Response
    {
        abort_unless($request->query('hub_mode') === 'subscribe' && hash_equals((string) config('communications.whatsapp.verify_token'), (string) $request->query('hub_verify_token')), 403);
        return response((string) $request->query('hub_challenge'), 200)->header('Content-Type', 'text/plain');
    }

    public function whatsapp(Request $request): JsonResponse
    {
        $secret=(string)config('communications.whatsapp.app_secret');abort_if($secret==='',503,'WhatsApp webhook secret is not configured.');$expected='sha256='.hash_hmac('sha256',$request->getContent(),$secret);abort_unless(hash_equals($expected,(string)$request->header('X-Hub-Signature-256')),401);
        foreach((array)data_get($request->all(),'entry',[]) as $entry)foreach((array)data_get($entry,'changes',[]) as $change)foreach((array)data_get($change,'value.statuses',[]) as $status)$this->applyStatus((string)($status['id']??''),(string)($status['status']??''),$status);
        return response()->json(['received'=>true]);
    }

    public function provider(Request $request): JsonResponse
    {
        $secret=(string)config('communications.webhook_secret');abort_if($secret==='',503,'Communication webhook secret is not configured.');$signature=(string)$request->header('X-Communication-Signature');$expected=hash_hmac('sha256',$request->getContent(),$secret);abort_unless(hash_equals($expected,$signature),401);$data=$request->validate(['message_id'=>['required','string','max:500'],'status'=>['required','in:sent,delivered,read,failed'],'error'=>['nullable','string','max:2000']]);$this->applyStatus($data['message_id'],$data['status'],$data);return response()->json(['received'=>true]);
    }

    private function applyStatus(string $providerId,string $status,array $payload):void
    {
        if($providerId==='')return;$recipient=CommunicationRecipient::where('provider_message_id',$providerId)->first();if(!$recipient)return;$mapped=match($status){'delivered','read'=>'delivered','failed'=>'failed',default=>'sent'};$recipient->update(['status'=>$mapped,'delivered_at'=>$mapped==='delivered'?now():$recipient->delivered_at,'failed_at'=>$mapped==='failed'?now():null,'failure_reason'=>$mapped==='failed'?mb_substr((string)($payload['error']??data_get($payload,'errors.0.title','Provider reported failure.')),0,2000):null,'provider_response'=>array_intersect_key($payload,array_flip(['id','status','timestamp','error','errors']))]);$this->syncCampaign($recipient->campaign_id);
    }

    private function syncCampaign(string $campaignId):void
    {
        $campaign=CommunicationCampaign::find($campaignId);if(!$campaign)return;$counts=CommunicationRecipient::where('campaign_id',$campaignId)->selectRaw("count(*) as total, count(*) filter (where status in ('sent','delivered')) as sent, count(*) filter (where status='delivered') as delivered, count(*) filter (where status='failed') as failed")->first();$finished=((int)$counts->sent+(int)$counts->failed)>=(int)$counts->total;$campaign->update(['recipient_count'=>$counts->total,'sent_count'=>$counts->sent,'delivered_count'=>$counts->delivered,'failed_count'=>$counts->failed,'status'=>$finished?'completed':'sending','completed_at'=>$finished?now():null]);
    }
}
