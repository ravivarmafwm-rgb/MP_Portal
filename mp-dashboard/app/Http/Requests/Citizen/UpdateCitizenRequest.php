<?php

namespace App\Http\Requests\Citizen;

use App\Models\Citizen;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCitizenRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('citizen')) ?? false;
    }

    public function rules(): array
    {
        /** @var Citizen $citizen */
        $citizen = $this->route('citizen');
        return [
            'first_name'         => ['sometimes', 'required', 'string', 'max:100'],
            'last_name'          => ['sometimes', 'required', 'string', 'max:100'],
            'middle_name'        => ['sometimes', 'nullable', 'string', 'max:100'],
            'date_of_birth'      => ['sometimes', 'required', 'date', 'before_or_equal:today'],
            'gender'             => ['sometimes', 'required', 'in:Male,Female,Other'],
            'mobile_number'      => ['sometimes', 'nullable', 'regex:/^[6-9][0-9]{9}$/', Rule::unique('citizens')->ignore($citizen)->whereNull('deleted_at')],
            'alternate_mobile'   => ['sometimes', 'nullable', 'regex:/^[6-9][0-9]{9}$/'],
            'voter_id'           => ['sometimes', 'nullable', 'string', 'max:30', Rule::unique('citizens')->ignore($citizen)->whereNull('deleted_at')],
            'occupation'         => ['sometimes', 'nullable', 'string', 'max:100'],
            'education'          => ['sometimes', 'nullable', 'string', 'max:100'],
            'marital_status'     => ['sometimes', 'nullable', 'in:Single,Married,Widowed,Divorced,Separated'],
            'father_name'        => ['sometimes', 'nullable', 'string', 'max:100'],
            'mother_name'        => ['sometimes', 'nullable', 'string', 'max:100'],
            'spouse_name'        => ['sometimes', 'nullable', 'string', 'max:100'],
            'blood_group'        => ['sometimes', 'nullable', 'in:A+,A-,B+,B-,AB+,AB-,O+,O-'],
            'email'              => ['sometimes', 'nullable', 'email:rfc', 'max:150'],
            'is_voter'           => ['sometimes', 'boolean'],
            'voter_status'       => ['sometimes', 'nullable', 'in:Active,Deleted,Shifted,Deceased,Duplicate'],
            'disability_status'  => ['sometimes', 'nullable', 'in:none,visual,hearing,locomotor,intellectual,multiple'],
            'disability_details' => ['sometimes', 'nullable', 'string', 'max:500'],
            'is_deceased'        => ['sometimes', 'boolean'],
            'date_of_death'      => ['sometimes', 'nullable', 'date'],
        ];
    }
}
