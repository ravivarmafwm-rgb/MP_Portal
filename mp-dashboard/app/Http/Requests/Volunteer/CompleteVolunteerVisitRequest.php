<?php
namespace App\Http\Requests\Volunteer;
use Illuminate\Foundation\Http\FormRequest;
class CompleteVolunteerVisitRequest extends FormRequest {
 public function authorize(): bool { return $this->user()?->can('update', $this->route('visit')) ?? false; }
 public function rules(): array { return ['latitude'=>['required','numeric','between:-90,90'],'longitude'=>['required','numeric','between:-180,180'],'outcome'=>['required','string','min:3','max:10000'],'notes'=>['nullable','string','max:10000'],'follow_up_required'=>['sometimes','boolean'],'follow_up_date'=>['nullable','date','after_or_equal:today'],'follow_up_notes'=>['nullable','string','max:5000'],'attachments'=>['nullable','array','max:5'],'attachments.*'=>['file','max:10240','mimes:jpg,jpeg,png,webp,pdf']]; }
}
