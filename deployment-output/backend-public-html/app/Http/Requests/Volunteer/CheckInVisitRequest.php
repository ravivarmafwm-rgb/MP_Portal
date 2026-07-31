<?php
namespace App\Http\Requests\Volunteer;
use Illuminate\Foundation\Http\FormRequest;
class CheckInVisitRequest extends FormRequest {
 public function authorize(): bool { return $this->user()?->can('update', $this->route('visit')) ?? false; }
 public function rules(): array { return ['latitude'=>['required','numeric','between:-90,90'],'longitude'=>['required','numeric','between:-180,180']]; }
}
