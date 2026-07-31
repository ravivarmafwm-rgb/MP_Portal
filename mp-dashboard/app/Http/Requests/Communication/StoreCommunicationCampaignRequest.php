<?php
namespace App\Http\Requests\Communication;
use Illuminate\Foundation\Http\FormRequest;use Illuminate\Validation\Rule;
class StoreCommunicationCampaignRequest extends FormRequest
{
 public function authorize():bool{return $this->user()?->hasPermission('communications.manage')??false;}
 public function rules():array{return ['name'=>['required','string','max:255'],'channel'=>['required',Rule::in(['sms','whatsapp','email','voice'])],'purpose'=>['required',Rule::in(['status_update','event_invitation','citizen_notification','volunteer_communication','department_follow_up','ivr_survey','general'])],'template_id'=>[Rule::requiredIf(fn()=>in_array($this->input('channel'),['sms','whatsapp','voice'],true)),'nullable','uuid','exists:communication_templates,id'],'subject'=>[Rule::requiredIf(fn()=>$this->input('channel')==='email'&&!$this->filled('template_id')),'nullable','string','max:255'],'body'=>['required_without:template_id','nullable','string','max:10000'],'audience_type'=>['required',Rule::in(['citizens','volunteers','departments'])],'audience_filters'=>['nullable','array'],'audience_filters.village_id'=>['nullable','uuid','exists:villages,id'],'audience_filters.ward_id'=>['nullable','uuid','exists:wards,id'],'audience_filters.status'=>['nullable','string','max:50'],'scheduled_at'=>['nullable','date','after:now']];}
}
