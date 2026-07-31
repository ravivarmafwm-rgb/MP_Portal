<?php

namespace App\Http\Requests\Grievance;

use Illuminate\Foundation\Http\FormRequest;

class AddGrievanceNoteRequest extends FormRequest
{
    public function authorize(): bool { return $this->user()?->hasPermission('grievances.update') ?? false; }
    public function rules(): array { return ['remarks' => ['required', 'string', 'min:1', 'max:10000']]; }
}
