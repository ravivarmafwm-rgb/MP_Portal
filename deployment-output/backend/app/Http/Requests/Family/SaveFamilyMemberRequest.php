<?php

namespace App\Http\Requests\Family;

use Illuminate\Foundation\Http\FormRequest;

class SaveFamilyMemberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('family')) ?? false;
    }

    public function rules(): array
    {
        return [
            'citizen_id' => ['required', 'uuid', 'exists:citizens,id'],
            'relationship_with_head' => ['required', 'string', 'max:80'],
            'is_head' => ['sometimes', 'boolean'],
            'date_of_joining_family' => ['nullable', 'date', 'before_or_equal:today'],
            'remarks' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
