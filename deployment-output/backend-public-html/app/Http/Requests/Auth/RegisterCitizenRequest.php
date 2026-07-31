<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\Rule;

class RegisterCitizenRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'min:1', 'max:100'],
            'last_name' => ['required', 'string', 'min:1', 'max:100'],
            'email' => ['required', 'email:rfc,dns', 'max:255', 'unique:users,email'],
            'mobile_number' => ['required', 'regex:/^[6-9][0-9]{9}$/', Rule::unique('citizens', 'mobile_number')],
            'date_of_birth' => ['required', 'date', 'before_or_equal:today'],
            'gender' => ['required', Rule::in(['Male', 'Female', 'Other'])],
            'password' => ['required', 'confirmed', Password::min(12)->mixedCase()->numbers()->symbols()],
            'password_confirmation' => ['required', 'string'],
            'role_slug' => ['prohibited'],
            'citizen_id' => ['prohibited'],
        ];
    }
}
