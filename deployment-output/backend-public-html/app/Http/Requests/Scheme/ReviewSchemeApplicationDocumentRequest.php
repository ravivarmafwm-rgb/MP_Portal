<?php

namespace App\Http\Requests\Scheme;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ReviewSchemeApplicationDocumentRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'action' => ['required', Rule::in(['verify', 'reject'])],
            'rejection_reason' => [
                Rule::requiredIf($this->input('action') === 'reject'),
                'nullable', 'string', 'min:15', 'max:2000',
            ],
        ];
    }
}
