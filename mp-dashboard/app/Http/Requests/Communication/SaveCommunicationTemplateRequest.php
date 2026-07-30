<?php
namespace App\Http\Requests\Communication;
use Illuminate\Foundation\Http\FormRequest;use Illuminate\Validation\Rule;
class SaveCommunicationTemplateRequest extends FormRequest
{
 public function authorize():bool{return $this->user()?->hasPermission('communications.manage')??false;}
 public function rules():array{return ['name'=>['required','string','max:255'],'channel'=>['required',Rule::in(['sms','whatsapp','email','voice'])],'purpose'=>['required',Rule::in(['status_update','event_invitation','citizen_notification','volunteer_communication','department_follow_up','ivr_survey','general'])],'subject'=>['nullable','required_if:channel,email','string','max:255'],'body'=>['required','string','max:10000'],'provider_template_id'=>['nullable',Rule::requiredIf(fn()=>in_array($this->input('channel'),['whatsapp','voice'],true)&&$this->input('status')==='approved'),'string','max:255'],'dlt_entity_id'=>['nullable','string','max:255'],'dlt_template_id'=>['nullable','required_if:channel,sms','string','max:255'],'variables'=>['nullable','array'],'variables.*'=>['string','max:100'],'status'=>['required',Rule::in(['draft','approved','archived'])],'is_active'=>['sometimes','boolean']];}
}
