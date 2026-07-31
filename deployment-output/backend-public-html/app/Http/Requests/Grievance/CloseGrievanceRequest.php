<?php

namespace App\Http\Requests\Grievance;

use Illuminate\Foundation\Http\FormRequest;

class CloseGrievanceRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'citizen_confirmed' => ['required', 'boolean'],
            'override_reason' => ['nullable', 'required_if:citizen_confirmed,false', 'string', 'min:20', 'max:2000'],
        ];
    }
}
