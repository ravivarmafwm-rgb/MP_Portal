<?php

namespace App\Http\Requests\Citizen;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SaveCitizenAddressRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('citizen')) ?? false;
    }

    public function rules(): array
    {
        $update = $this->isMethod('put') || $this->isMethod('patch');
        return [
            'address_type' => [$update ? 'sometimes' : 'required', 'string', 'max:40'],
            'village_id' => ['sometimes', 'nullable', 'uuid', 'exists:villages,id'],
            'ward_id' => ['sometimes', 'nullable', 'uuid', 'exists:wards,id'],
            'polling_booth_id' => ['sometimes', 'nullable', 'uuid', 'exists:polling_booths,id'],
            'house_number' => ['sometimes', 'nullable', 'string', 'max:80'],
            'street' => ['sometimes', 'nullable', 'string', 'max:150'],
            'locality' => ['sometimes', 'nullable', 'string', 'max:150'],
            'landmark' => ['sometimes', 'nullable', 'string', 'max:150'],
            'post_office' => ['sometimes', 'nullable', 'string', 'max:100'],
            'pincode' => [$update ? 'sometimes' : 'required', 'string', 'regex:/^[1-9][0-9]{5}$/'],
            'district' => [$update ? 'sometimes' : 'required', 'string', 'max:100'],
            'state' => [$update ? 'sometimes' : 'required', 'in:Andhra Pradesh'],
            'country' => ['sometimes', 'nullable', 'string', 'max:100'],
            'latitude' => ['sometimes', 'nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['sometimes', 'nullable', 'numeric', 'between:-180,180'],
            'is_primary' => ['sometimes', 'boolean'],
            'valid_from' => ['sometimes', 'nullable', 'date'],
            'valid_to' => ['sometimes', 'nullable', 'date', 'after_or_equal:valid_from'],
        ];
    }
}
