<?php

namespace App\Http\Requests\Citizen;

use Illuminate\Foundation\Http\FormRequest;

class MapCitizenBoothRequest extends FormRequest
{
    public function authorize(): bool { return $this->user() !== null; }
    public function rules(): array
    {
        return ['address_id' => ['required', 'uuid', 'exists:citizen_addresses,id'], 'polling_booth_id' => ['required', 'uuid', 'exists:polling_booths,id']];
    }
}
