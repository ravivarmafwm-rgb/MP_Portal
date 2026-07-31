<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class VolunteerApplicationRequest extends FormRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'min:2', 'max:100'], 'last_name' => ['required', 'string', 'min:2', 'max:100'],
            'email' => ['required', 'email:rfc,dns', 'max:255', 'unique:volunteer_applications,email', 'unique:users,email'],
            'mobile_number' => ['required', 'regex:/^[6-9][0-9]{9}$/', 'unique:volunteer_applications,mobile_number'],
            'date_of_birth' => ['required', 'date', 'before_or_equal:-18 years'], 'gender' => ['required', 'in:Male,Female,Other'],
            'village_id' => ['required', 'uuid', 'exists:villages,id'], 'ward_id' => ['nullable', 'uuid', 'exists:wards,id'],
            'address' => ['required', 'string', 'max:1000'], 'motivation' => ['required', 'string', 'min:30', 'max:2000'],
        ];
    }
}
