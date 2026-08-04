<?php

namespace App\Http\Requests\Scheme;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ReviewSchemeApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'action' => ['required', Rule::in(['start_review', 'mark_pending', 'approve', 'reject'])],
            'remarks' => ['nullable', 'string', 'max:3000'],
            'rejection_reason' => [
                Rule::requiredIf($this->input('action') === 'reject'),
                'nullable', 'string', 'min:20', 'max:2000',
            ],
            'pending_reason' => [
                Rule::requiredIf($this->input('action') === 'mark_pending'),
                'nullable', 'string', 'min:10', 'max:3000',
            ],
            'sanctioned_amount' => [
                Rule::requiredIf($this->input('action') === 'approve'),
                'nullable', 'numeric', 'min:0.01',
            ],
            'sanction_order_number' => [
                Rule::requiredIf($this->input('action') === 'approve'),
                'nullable', 'string', 'max:100',
            ],
        ];
    }
}
