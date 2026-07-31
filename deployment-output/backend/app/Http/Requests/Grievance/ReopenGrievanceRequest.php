<?php

namespace App\Http\Requests\Grievance;

use Illuminate\Foundation\Http\FormRequest;

class ReopenGrievanceRequest extends FormRequest
{
    public function authorize(): bool { return $this->user()?->hasPermission('grievances.update') ?? false; }
    public function rules(): array { return ['reason' => ['required', 'string', 'min:10', 'max:2000']]; }
}
