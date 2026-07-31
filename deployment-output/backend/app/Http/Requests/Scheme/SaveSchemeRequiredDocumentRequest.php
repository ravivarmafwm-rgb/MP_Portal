<?php

namespace App\Http\Requests\Scheme;

use Illuminate\Foundation\Http\FormRequest;

class SaveSchemeRequiredDocumentRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'document_category_id' => ['required', 'uuid', 'exists:document_categories,id'],
            'name' => ['required', 'string', 'min:3', 'max:150'],
            'description' => ['nullable', 'string', 'max:2000'],
            'is_mandatory' => ['required', 'boolean'],
            'max_age_days' => ['nullable', 'integer', 'min:1', 'max:3650'],
            'sort_order' => ['sometimes', 'integer', 'min:0', 'max:1000'],
            'is_active' => ['required', 'boolean'],
        ];
    }
}
