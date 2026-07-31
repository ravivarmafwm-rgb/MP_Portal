<?php

namespace App\Http\Requests\Grievance;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreGrievanceRequest extends FormRequest
{
    public function authorize(): bool { return $this->user()?->hasPermission('grievances.create') ?? false; }

    public function rules(): array
    {
        return [
            'category_id' => ['required', 'uuid', 'exists:grievance_categories,id'],
            'citizen_id' => ['nullable', 'uuid', 'exists:citizens,id'],
            'citizen_name' => ['required', 'string', 'max:150'],
            'citizen_mobile' => ['required', 'string', 'max:15'],
            'citizen_email' => ['nullable', 'email', 'max:255'],
            'subject' => ['required', 'string', 'min:5', 'max:255'],
            'description' => ['required', 'string', 'min:10', 'max:10000'],
            'priority' => ['sometimes', Rule::in(['low', 'medium', 'high', 'urgent'])],
            'village_id' => ['nullable', 'uuid', 'exists:villages,id'],
            'ward_id' => ['nullable', 'uuid', 'exists:wards,id'],
            'source' => ['nullable', 'string', 'max:50'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
        ];
    }
}
