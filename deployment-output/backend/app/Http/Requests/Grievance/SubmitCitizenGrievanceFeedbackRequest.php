<?php

namespace App\Http\Requests\Grievance;

use Illuminate\Foundation\Http\FormRequest;

class SubmitCitizenGrievanceFeedbackRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'rating' => ['required', 'integer', 'between:1,5'],
            'comments' => ['required', 'string', 'min:10', 'max:2000'],
            'would_recommend' => ['nullable', 'boolean'],
            'reopen_requested' => ['sometimes', 'boolean'],
            'reopen_reason' => ['nullable', 'required_if:reopen_requested,true', 'string', 'min:20', 'max:2000'],
        ];
    }
}
