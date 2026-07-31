<?php

namespace App\Http\Requests\Citizen;

use Illuminate\Foundation\Http\FormRequest;

class BulkUpdateCitizensRequest extends FormRequest
{
    public function authorize(): bool { return $this->user()?->hasPermission('citizens.update') ?? false; }
    public function rules(): array
    {
        return [
            'citizen_ids' => ['required', 'array', 'min:1', 'max:500'],
            'citizen_ids.*' => ['required', 'uuid', 'distinct', 'exists:citizens,id'],
            'occupation' => ['sometimes', 'nullable', 'string', 'max:100'],
            'education' => ['sometimes', 'nullable', 'string', 'max:100'],
            'is_voter' => ['sometimes', 'boolean'],
            'voter_status' => ['sometimes', 'nullable', 'string', 'max:50'],
        ];
    }
}
