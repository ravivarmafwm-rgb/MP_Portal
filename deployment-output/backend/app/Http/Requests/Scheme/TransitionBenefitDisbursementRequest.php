<?php

namespace App\Http\Requests\Scheme;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TransitionBenefitDisbursementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'action' => ['required', Rule::in(['complete', 'fail', 'retry'])],
            'transaction_id' => [
                Rule::requiredIf($this->input('action') === 'complete'),
                'nullable', 'string', 'max:150',
            ],
            'failure_reason' => [
                Rule::requiredIf($this->input('action') === 'fail'),
                'nullable', 'string', 'min:15', 'max:2000',
            ],
            'retry_date' => [
                Rule::requiredIf($this->input('action') === 'retry'),
                'nullable', 'date', 'after_or_equal:today',
            ],
            'remarks' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
