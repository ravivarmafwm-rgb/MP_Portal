<?php
namespace App\Http\Requests\Volunteer;
use Illuminate\Foundation\Http\FormRequest;
class UpdateVolunteerVisitRequest extends FormRequest {
 public function authorize(): bool { return $this->user()?->can('update', $this->route('visit')) ?? false; }
 public function rules(): array { return ['volunteer_id'=>['sometimes','uuid','exists:volunteers,id'],'status'=>['sometimes','in:assigned,accepted,checked_in,completed,missed,cancelled'],'scheduled_at'=>['sometimes','date'],'notes'=>['sometimes','nullable','string','max:10000'],'outcome'=>['sometimes','nullable','string','max:10000'],'follow_up_required'=>['sometimes','boolean'],'follow_up_date'=>['sometimes','nullable','date','after_or_equal:today'],'follow_up_notes'=>['sometimes','nullable','string','max:5000']]; }
}
