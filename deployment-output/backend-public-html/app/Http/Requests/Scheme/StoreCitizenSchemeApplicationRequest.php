<?php

namespace App\Http\Requests\Scheme;

use Illuminate\Foundation\Http\FormRequest;

class StoreCitizenSchemeApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasRole(['citizen', 'volunteer']) === true;
    }

    public function rules(): array
    {
        return [
            'scheme_id' => ['required', 'uuid', 'exists:schemes,id'],
            'remarks' => ['nullable', 'string', 'max:2000'],
            'target_citizen_id' => ['nullable', 'uuid', 'exists:citizens,id'],
        ];
    }
}
