<?php

namespace App\Http\Requests\Citizen;

use App\Models\Citizen;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCitizenRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Citizen::class) ?? false;
    }

    public function rules(): array
    {
        return [
            'first_name'             => ['required', 'string', 'max:100'],
            'last_name'              => ['required', 'string', 'max:100'],
            'middle_name'            => ['nullable', 'string', 'max:100'],
            'date_of_birth'          => ['required', 'date', 'before_or_equal:today'],
            'gender'                 => ['required', 'in:Male,Female,Other'],
            'mobile_number'          => ['nullable', 'regex:/^[6-9][0-9]{9}$/', Rule::unique('citizens')->whereNull('deleted_at')],
            'alternate_mobile'       => ['nullable', 'regex:/^[6-9][0-9]{9}$/'],
            'aadhaar_number'         => ['nullable', 'regex:/^[0-9]{12}$/'],
            'voter_id'               => ['nullable', 'string', 'max:30', Rule::unique('citizens')->whereNull('deleted_at')],
            'occupation'             => ['nullable', 'string', 'max:100'],
            'education'              => ['nullable', 'string', 'max:100'],
            'marital_status'         => ['nullable', 'in:Single,Married,Widowed,Divorced,Separated'],
            'father_name'            => ['nullable', 'string', 'max:100'],
            'mother_name'            => ['nullable', 'string', 'max:100'],
            'spouse_name'            => ['nullable', 'string', 'max:100'],
            'blood_group'            => ['nullable', 'in:A+,A-,B+,B-,AB+,AB-,O+,O-'],
            'email'                  => ['nullable', 'email:rfc', 'max:150'],
            'is_voter'               => ['required', 'boolean'],
            'voter_status'           => ['nullable', 'in:Active,Deleted,Shifted,Deceased,Duplicate'],
            'disability_status'      => ['nullable', 'in:none,visual,hearing,locomotor,intellectual,multiple'],
            'disability_details'     => ['nullable', 'string', 'max:500'],
            'village_id'             => ['required', 'uuid', 'exists:villages,id'],
            'ward_id'                => ['nullable', 'uuid', 'exists:wards,id'],
            'polling_booth_id'       => ['nullable', 'uuid', 'exists:polling_booths,id'],
            'house_number'           => ['nullable', 'string', 'max:50'],
            'street'                 => ['nullable', 'string', 'max:150'],
            'locality'               => ['nullable', 'string', 'max:150'],
            'landmark'               => ['nullable', 'string', 'max:150'],
            'pincode'                => ['required', 'regex:/^[0-9]{6}$/'],
            'district'               => ['required', 'string', 'max:100'],
            'state'                  => ['required', 'in:Andhra Pradesh'],
            'family_id'              => ['nullable', 'uuid', 'exists:families,id'],
            'relationship_with_head' => ['required_with:family_id', 'nullable', 'string', 'max:80'],
        ];
    }
}
