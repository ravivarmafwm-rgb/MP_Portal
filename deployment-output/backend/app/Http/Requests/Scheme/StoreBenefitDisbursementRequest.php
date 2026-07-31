<?php

namespace App\Http\Requests\Scheme;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBenefitDisbursementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'amount' => ['required', 'numeric', 'min:0.01'],
            'payment_mode' => ['required', Rule::in(['bank_transfer', 'cheque', 'cash', 'in_kind'])],
            'disbursement_date' => ['required', 'date', 'before_or_equal:today'],
            'bank_name' => ['required_if:payment_mode,bank_transfer', 'nullable', 'string', 'max:150'],
            'account_number' => ['required_if:payment_mode,bank_transfer', 'nullable', 'string', 'regex:/^[0-9]{9,18}$/'],
            'ifsc_code' => ['required_if:payment_mode,bank_transfer', 'nullable', 'string', 'regex:/^[A-Za-z]{4}0[A-Za-z0-9]{6}$/'],
            'reference_number' => ['required_unless:payment_mode,cash', 'nullable', 'string', 'max:100'],
            'remarks' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
