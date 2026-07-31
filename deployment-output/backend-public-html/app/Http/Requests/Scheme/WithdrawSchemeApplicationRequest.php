<?php

namespace App\Http\Requests\Scheme;

use Illuminate\Foundation\Http\FormRequest;

class WithdrawSchemeApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasRole('citizen') === true;
    }

    public function rules(): array
    {
        return [
            'reason' => ['required', 'string', 'min:15', 'max:2000'],
        ];
    }
}
