<?php

namespace App\Http\Requests\Grievance;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateGrievancePriorityRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return ['priority' => ['required', Rule::in(['low', 'medium', 'high', 'urgent'])]];
    }
}
