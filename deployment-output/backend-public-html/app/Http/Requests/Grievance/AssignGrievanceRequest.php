<?php

namespace App\Http\Requests\Grievance;

use Illuminate\Foundation\Http\FormRequest;

class AssignGrievanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'assigned_to' => ['required', 'uuid', 'exists:users,id'],
            'department_id' => ['required', 'uuid', 'exists:departments,id'],
            'due_date' => ['nullable', 'date', 'after_or_equal:today'],
            'instructions' => ['required', 'string', 'max:3000'],
        ];
    }
}
