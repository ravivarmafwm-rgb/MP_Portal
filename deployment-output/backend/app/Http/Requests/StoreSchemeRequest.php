<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSchemeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', \App\Models\Scheme::class) ?? false;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:50', Rule::unique('schemes', 'code')],
            'category' => ['required', 'string', 'max:100'],
            'department_id' => ['nullable', 'uuid', 'exists:departments,id'],
            'description' => ['nullable', 'string', 'max:10000'],
            'objectives' => ['nullable', 'string', 'max:10000'],
            'eligibility' => ['nullable', 'string', 'max:10000'],
            'benefits' => ['nullable', 'string', 'max:10000'],
            'documents_required' => ['nullable', 'string', 'max:10000'],
            'max_amount' => ['nullable', 'numeric', 'min:0', 'max:9999999999999.99'],
            'funding_source' => ['nullable', 'string', 'max:255'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'is_active' => ['sometimes', 'boolean'],
            'application_mode' => ['required', Rule::in(['online', 'offline', 'both'])],
            'approval_authority' => ['nullable', 'string', 'max:255'],
            'sla_days' => ['required', 'integer', 'min:1', 'max:3650'],
            'website_url' => ['nullable', 'url', 'max:2048'],
            'helpline_number' => ['nullable', 'string', 'max:30'],
            'remarks' => ['nullable', 'string', 'max:10000'],
        ];
    }
}
