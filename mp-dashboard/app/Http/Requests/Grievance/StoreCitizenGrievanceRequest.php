<?php

namespace App\Http\Requests\Grievance;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCitizenGrievanceRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    protected function prepareForValidation(): void
    {
        if ($this->user()?->hasRole('citizen') && !$this->user()->citizen_id) {
            abort(409, 'This account is not linked to a citizen record.');
        }
    }

    public function rules(): array
    {
        return [
            'category_id' => ['required', 'uuid', 'exists:grievance_categories,id'],
            'subject' => ['required', 'string', 'min:10', 'max:255'],
            'description' => ['required', 'string', 'min:30', 'max:10000'],
            'priority' => ['required', Rule::in(['low', 'medium', 'high'])],
        ];
    }
}
