<?php

namespace App\Http\Requests\Grievance;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RespondToGrievanceAssignmentRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'action' => ['required', Rule::in(['accept', 'reject'])],
            'rejection_reason' => ['nullable', 'required_if:action,reject', 'string', 'min:10', 'max:2000'],
        ];
    }
}
