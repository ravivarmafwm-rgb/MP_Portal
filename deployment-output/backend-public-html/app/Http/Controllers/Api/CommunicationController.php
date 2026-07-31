<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Communication\RecordCommunicationConsentRequest;
use App\Http\Requests\Communication\SaveCommunicationTemplateRequest;
use App\Http\Requests\Communication\StoreCommunicationCampaignRequest;
use App\Jobs\DeliverCommunicationRecipient;
use App\Models\ActivityLog;
use App\Models\Citizen;
use App\Models\CommunicationCampaign;
use App\Models\CommunicationConsent;
use App\Models\CommunicationRecipient;
use App\Models\CommunicationTemplate;
use App\Models\Department;
use App\Models\Volunteer;
use App\Services\CommunicationCampaignDispatcher;
use App\Services\GeographicScopeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class CommunicationController extends Controller
{
    public function dashboard(Request $request): JsonResponse
    {
        $this->requireView($request); $base=CommunicationCampaign::query();
        return response()->json(['total'=>(clone $base)->count(),'draft'=>(clone $base)->where('status','draft')->count(),'scheduled'=>(clone $base)->where('status','scheduled')->count(),'completed'=>(clone $base)->where('status','completed')->count(),'failed_recipients'=>(int)DB::table('communication_recipients')->where('status','failed')->count(),'by_channel'=>(clone $base)->selectRaw('channel, count(*) as total')->groupBy('channel')->pluck('total','channel')]);
    }

    public function templates(Request $request): JsonResponse
    {
        $this->requireView($request); $query=CommunicationTemplate::query();
        if($channel=$request->string('channel')->toString())$query->where('channel',$channel); if($status=$request->string('status')->toString())$query->where('status',$status); if($search=trim($request->string('search')->toString()))$query->where('name','ilike',"%{$search}%");
        return response()->json($query->orderBy('name')->paginate(min(max($request->integer('per_page',20),1),100)));
    }

    public function storeTemplate(SaveCommunicationTemplateRequest $request): JsonResponse
    {
        if($request->validated('status')==='approved')abort_unless($request->user()->hasPermission('communications.approve'),403);
        $template=DB::transaction(function()use($request){$row=CommunicationTemplate::create([...$request->validated(),'created_by'=>$request->user()->id]);$this->audit($request,'template_created',$row->id,['name'=>$row->name,'channel'=>$row->channel]);return$row;}); return response()->json($template,201);
    }

    public function updateTemplate(SaveCommunicationTemplateRequest $request,string $template): JsonResponse
    {
        if($request->validated('status')==='approved')abort_unless($request->user()->hasPermission('communications.approve'),403); $row=CommunicationTemplate::findOrFail($template);$old=$row->getAttributes();
        DB::transaction(function()use($row,$request,$old){$row->update([...$request->validated(),'updated_by'=>$request->user()->id]);$this->audit($request,'template_updated',$row->id,['old'=>$old,'new'=>$row->fresh()->getAttributes()]);}); return response()->json($row->fresh());
    }

    public function campaigns(Request $request): JsonResponse
    {
        $this->requireView($request);$query=CommunicationCampaign::with('template:id,name');$this->scopeCampaigns($query,$request);if($channel=$request->string('channel')->toString())$query->where('channel',$channel);if($status=$request->string('status')->toString())$query->where('status',$status);if($search=trim($request->string('search')->toString()))$query->where('name','ilike',"%{$search}%");return response()->json($query->latest()->paginate(min(max($request->integer('per_page',20),1),100)));
    }

    public function storeCampaign(StoreCommunicationCampaignRequest $request): JsonResponse
    {
        $data=$request->validated();$template=!empty($data['template_id'])?CommunicationTemplate::findOrFail($data['template_id']):null;if($template&&($template->channel!==$data['channel']||!$template->is_active||$template->status!=='approved'))throw ValidationException::withMessages(['template_id'=>['Select an active approved template for the chosen channel.']]);
        $scope=array_filter($request->user()->only(['constituency_id','assembly_constituency_id','mandal_id','village_id','ward_id']));$row=DB::transaction(function()use($data,$template,$request,$scope){$campaign=CommunicationCampaign::create(['campaign_number'=>'COM-'.now()->format('Ymd').'-'.Str::upper(Str::random(6)),'name'=>$data['name'],'channel'=>$data['channel'],'purpose'=>$data['purpose'],'template_id'=>$template?->id,'subject'=>$data['subject']??$template?->subject,'body'=>$data['body']??$template?->body,'audience_filters'=>['type'=>$data['audience_type'],...($data['audience_filters']??[]),...$scope],'status'=>!empty($data['scheduled_at'])?'scheduled':'draft','scheduled_at'=>$data['scheduled_at']??null,'created_by'=>$request->user()->id]);$this->audit($request,'campaign_created',$campaign->id,['name'=>$campaign->name,'channel'=>$campaign->channel]);return$campaign;});return response()->json($row,201);
    }

    public function contacts(Request $request, GeographicScopeService $scope): JsonResponse
    {
        $this->requireView($request);$type=$request->validate(['type'=>['required','in:citizen,volunteer,department'],'search'=>['nullable','string','max:100']])['type'];$search=trim($request->string('search')->toString());
        if($type==='citizen'){$query=Citizen::query();if($search)$query->where(fn($q)=>$q->where('first_name','ilike',"%{$search}%")->orWhere('last_name','ilike',"%{$search}%")->orWhere('mobile_number','ilike',"%{$search}%")->orWhere('email','ilike',"%{$search}%"));$scope->apply($query,$request->user());$rows=$query->limit(20)->get()->map(fn($c)=>['id'=>$c->id,'name'=>trim($c->first_name.' '.$c->last_name),'mobile'=>$this->maskPhone($c->mobile_number),'email'=>$this->maskEmail($c->email)]);}
        elseif($type==='volunteer'){$query=Volunteer::query();if($search)$query->where(fn($q)=>$q->where('first_name','ilike',"%{$search}%")->orWhere('last_name','ilike',"%{$search}%")->orWhere('mobile_number','ilike',"%{$search}%")->orWhere('email','ilike',"%{$search}%"));$scope->apply($query,$request->user());$rows=$query->limit(20)->get()->map(fn($v)=>['id'=>$v->id,'name'=>trim($v->first_name.' '.$v->last_name),'mobile'=>$this->maskPhone($v->mobile_number),'email'=>$this->maskEmail($v->email)]);}
        else{$query=Department::query();if($search)$query->where('name','ilike',"%{$search}%");$rows=$query->limit(20)->get()->map(fn($d)=>['id'=>$d->id,'name'=>$d->name,'mobile'=>$this->maskPhone($d->contact_phone),'email'=>$this->maskEmail($d->contact_email)]);}return response()->json($rows);
    }

    public function consents(Request $request,GeographicScopeService $scope): JsonResponse{$this->requireView($request);$data=$request->validate(['contact_type'=>['required','in:citizen,volunteer,department'],'contact_id'=>['required','uuid']]);$model=match($data['contact_type']){'citizen'=>Citizen::class,'volunteer'=>Volunteer::class,'department'=>Department::class};$contact=$model::findOrFail($data['contact_id']);if(!($contact instanceof Department))abort_unless($scope->allows($request->user(),$contact),403);return response()->json(CommunicationConsent::where($data)->orderBy('channel')->orderBy('purpose')->get());}

    public function recordConsent(RecordCommunicationConsentRequest $request, GeographicScopeService $scope): JsonResponse
    {
        $data=$request->validated();$model=match($data['contact_type']){'citizen'=>Citizen::class,'volunteer'=>Volunteer::class,'department'=>Department::class};$contact=$model::findOrFail($data['contact_id']);if(!($contact instanceof Department))abort_unless($scope->allows($request->user(),$contact),403);
        $row=CommunicationConsent::updateOrCreate(['contact_type'=>$data['contact_type'],'contact_id'=>$data['contact_id'],'channel'=>$data['channel'],'purpose'=>$data['purpose']],[...$data,'granted_at'=>$data['is_granted']?now():null,'revoked_at'=>$data['is_granted']?null:now(),'recorded_by'=>$request->user()->id]);$this->audit($request,$data['is_granted']?'consent_granted':'consent_revoked',$row->id,['contact_type'=>$row->contact_type,'channel'=>$row->channel,'purpose'=>$row->purpose]);return response()->json($row,201);
    }

    public function approve(Request $request,string $campaign):JsonResponse{abort_unless($request->user()->hasPermission('communications.approve'),403);$row=CommunicationCampaign::findOrFail($campaign);$this->authorizeCampaignScope($request,$row);abort_unless(in_array($row->status,['draft','scheduled'],true),409,'Only draft or scheduled campaigns can be approved.');$row->update(['status'=>'approved','approved_by'=>$request->user()->id,'approved_at'=>now()]);$this->audit($request,'campaign_approved',$row->id,['approved_at'=>$row->approved_at]);return response()->json($row);}
    public function dispatch(Request $request,string $campaign,CommunicationCampaignDispatcher $dispatcher):JsonResponse{abort_unless($request->user()->hasPermission('communications.manage'),403);$row=CommunicationCampaign::findOrFail($campaign);$this->authorizeCampaignScope($request,$row);abort_unless($row->status==='approved',409,'The campaign must be approved before dispatch.');abort_if($row->scheduled_at&&$row->scheduled_at->isFuture(),409,'The campaign is scheduled for a future time.');$count=$dispatcher->dispatch($row);$this->audit($request,'campaign_dispatched',$row->id,['recipient_count'=>$count]);return response()->json(['message'=>'Campaign queued for delivery.','recipient_count'=>$count]);}
    public function retry(Request $request,string $campaign):JsonResponse{abort_unless($request->user()->hasPermission('communications.manage'),403);$row=CommunicationCampaign::findOrFail($campaign);$this->authorizeCampaignScope($request,$row);$ids=$row->recipients()->where('status','failed')->where('attempts','<',6)->pluck('id');abort_if($ids->isEmpty(),409,'There are no retryable failed recipients.');$row->recipients()->whereIn('id',$ids)->update(['status'=>'queued','queued_at'=>now(),'failure_reason'=>null]);$row->update(['status'=>'sending','completed_at'=>null]);$ids->each(fn($id)=>DeliverCommunicationRecipient::dispatch($id)->onQueue('communications'));$this->audit($request,'campaign_retry_queued',$row->id,['recipient_count'=>$ids->count()]);return response()->json(['message'=>'Failed recipients queued for retry.','recipient_count'=>$ids->count()]);}

    private function requireView(Request $request):void{abort_unless($request->user()->hasPermission('communications.view'),403);}
    private function scopeCampaigns($query,Request $request):void{foreach(['constituency_id','assembly_constituency_id','mandal_id','village_id','ward_id']as$field)if($request->user()->{$field})$query->where("audience_filters->{$field}",$request->user()->{$field});}
    private function authorizeCampaignScope(Request $request,CommunicationCampaign $campaign):void{$filters=$campaign->audience_filters??[];foreach(['constituency_id','assembly_constituency_id','mandal_id','village_id','ward_id']as$field)if($request->user()->{$field}&&($filters[$field]??null)!==$request->user()->{$field})abort(403);}
    private function audit(Request $request,string $action,string $id,array $values):void{ActivityLog::create(['user_id'=>$request->user()->id,'loggable_type'=>CommunicationCampaign::class,'loggable_id'=>$id,'action'=>$action,'module'=>'communications','description'=>str_replace('_',' ',$action),'new_values'=>$values,'ip_address'=>$request->ip(),'user_agent'=>$request->userAgent()]);}
    private function maskPhone(?string $value):?string{return$value?'******'.substr($value,-4):null;}
    private function maskEmail(?string $value):?string{if(!$value)return null;[$name,$domain]=array_pad(explode('@',$value,2),2,'');return substr($name,0,1).'***@'.$domain;}
}
