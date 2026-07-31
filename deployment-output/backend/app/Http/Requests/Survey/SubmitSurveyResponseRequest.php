<?php

namespace App\Http\Requests\Survey;

use Illuminate\Foundation\Http\FormRequest;

class SubmitSurveyResponseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasPermission('surveys.submit') ?? false;
    }

    public function rules(): array
    {
        return [
            'client_submission_id' => ['nullable', 'uuid'],
            'collected_at' => ['nullable', 'date', 'before_or_equal:now'],
            'submitted_offline' => ['nullable', 'boolean'],
            'citizen_id' => ['nullable', 'uuid', 'exists:citizens,id'],
            'respondent_name' => ['nullable', 'string', 'max:255'],
            'respondent_mobile' => ['nullable', 'regex:/^[6-9][0-9]{9}$/'],
            'village_id' => ['required', 'uuid', 'exists:villages,id'],
            'ward_id' => ['nullable', 'uuid', 'exists:wards,id'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'remarks' => ['nullable', 'string', 'max:2000'],
            'answers' => ['nullable', 'array'],
            'answers.*' => ['nullable'],
            'attachments' => ['nullable', 'array'],
            'attachments.*' => ['file', 'max:10240', 'mimes:pdf,jpg,jpeg,png,webp,doc,docx'],
        ];
    }
}
