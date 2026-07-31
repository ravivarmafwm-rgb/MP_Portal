<?php

namespace App\Http\Requests\Family;

use Illuminate\Foundation\Http\FormRequest;

class StoreFamilyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', \App\Models\Family::class) ?? false;
    }

    public function rules(): array
    {
        return [
            'head_citizen_id' => ['required', 'uuid', 'exists:citizens,id'],
            'village_id' => ['required', 'uuid', 'exists:villages,id'],
            'ward_id' => ['nullable', 'uuid', 'exists:wards,id'],
            'polling_booth_id' => ['nullable', 'uuid', 'exists:polling_booths,id'],
            'house_number' => ['nullable', 'string', 'max:50'],
            'street' => ['nullable', 'string', 'max:150'],
            'locality' => ['nullable', 'string', 'max:150'],
            'ration_card_number' => ['nullable', 'string', 'max:50'],
            'ration_card_type' => ['nullable', 'string', 'max:50'],
            'annual_income' => ['nullable', 'numeric', 'min:0', 'max:999999999.99'],
            'economic_status' => ['required', 'in:bpl,low,middle,upper_middle,high'],
            'caste' => ['nullable', 'string', 'max:100'],
            'religion' => ['nullable', 'string', 'max:100'],
            'is_bpl' => ['required', 'boolean'],
            'remarks' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
