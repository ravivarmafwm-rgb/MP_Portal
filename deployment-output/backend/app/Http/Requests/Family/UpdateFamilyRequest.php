<?php

namespace App\Http\Requests\Family;

class UpdateFamilyRequest extends StoreFamilyRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('family')) ?? false;
    }

    public function rules(): array
    {
        return collect(parent::rules())
            ->map(fn (array $rules) => array_merge(['sometimes'], $rules))
            ->all();
    }
}
