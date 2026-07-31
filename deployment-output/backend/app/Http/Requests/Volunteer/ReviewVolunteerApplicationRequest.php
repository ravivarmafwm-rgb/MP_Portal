<?php

namespace App\Http\Requests\Volunteer;

use Illuminate\Foundation\Http\FormRequest;

class ReviewVolunteerApplicationRequest extends FormRequest
{
    public function authorize(): bool { return $this->user()?->hasPermission('volunteers.manage') ?? false; }
    public function rules(): array { return ['decision' => ['required', 'in:approved,rejected'], 'review_notes' => ['nullable', 'required_if:decision,rejected', 'string', 'min:5', 'max:2000']]; }
}
