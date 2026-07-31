<?php

namespace App\Http\Requests\Citizen;

use Illuminate\Foundation\Http\FormRequest;

class BulkArchiveCitizensRequest extends FormRequest
{
    public function authorize(): bool { return $this->user()?->hasPermission('citizens.delete') ?? false; }
    public function rules(): array
    {
        return ['citizen_ids' => ['required', 'array', 'min:1', 'max:100'], 'citizen_ids.*' => ['required', 'uuid', 'distinct', 'exists:citizens,id']];
    }
}
