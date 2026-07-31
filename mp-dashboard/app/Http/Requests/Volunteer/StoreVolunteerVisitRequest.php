<?php
namespace App\Http\Requests\Volunteer;
use Illuminate\Foundation\Http\FormRequest;
class StoreVolunteerVisitRequest extends FormRequest {
 public function authorize(): bool { return $this->user()?->can('create', \App\Models\VolunteerVisit::class) ?? false; }
 public function rules(): array { return ['volunteer_id'=>['required','uuid','exists:volunteers,id'],'citizen_id'=>['nullable','uuid','exists:citizens,id'],'family_id'=>['nullable','uuid','exists:families,id'],'village_id'=>['required','uuid','exists:villages,id'],'ward_id'=>['nullable','uuid','exists:wards,id'],'visit_type'=>['required','in:household,citizen,scheme,survey,grievance,follow_up'],'scheduled_at'=>['required','date'],'notes'=>['nullable','string','max:10000'],'follow_up_required'=>['sometimes','boolean'],'follow_up_date'=>['sometimes','nullable','date','after_or_equal:today'],'follow_up_notes'=>['sometimes','nullable','string','max:5000']]; }
}
