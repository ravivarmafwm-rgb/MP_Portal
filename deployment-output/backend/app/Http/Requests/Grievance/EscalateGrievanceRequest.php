<?php

namespace App\Http\Requests\Grievance;

use Illuminate\Foundation\Http\FormRequest;

class EscalateGrievanceRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'reason' => ['required', 'in:sla_breach,non_response,priority_change,citizen_request,management_review,other'],
            'description' => ['required', 'string', 'max:3000'],
            'escalated_to' => ['nullable', 'uuid', 'exists:users,id'],
        ];
    }
}
