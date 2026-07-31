<?php

namespace App\Http\Requests\Grievance;

use Illuminate\Foundation\Http\FormRequest;

class ResolveGrievanceRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'resolution_summary' => ['required', 'string', 'min:20', 'max:255'],
            'public_remarks' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
