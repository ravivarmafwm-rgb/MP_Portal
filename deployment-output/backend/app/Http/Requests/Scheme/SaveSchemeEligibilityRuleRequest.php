<?php

namespace App\Http\Requests\Scheme;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class SaveSchemeEligibilityRuleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'rule_name' => ['required', 'string', 'min:3', 'max:150'],
            'field_name' => ['required', Rule::in(['age', 'gender', 'disability_status', 'occupation', 'marital_status'])],
            'operator' => ['required', Rule::in(['equals', 'not_equals', 'greater_than_or_equal', 'less_than_or_equal', 'in'])],
            'value' => ['required', 'string', 'max:500'],
            'is_mandatory' => ['required', 'boolean'],
            'sort_order' => ['sometimes', 'integer', 'min:0', 'max:1000'],
            'error_message' => ['required', 'string', 'min:10', 'max:500'],
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator) {
                $field = $this->input('field_name');
                $operator = $this->input('operator');
                $value = trim((string) $this->input('value'));
                if ($field === 'age' && (!in_array($operator, ['greater_than_or_equal', 'less_than_or_equal', 'equals'], true)
                    || !ctype_digit($value) || (int) $value > 125)) {
                    $validator->errors()->add('value', 'Age rules require a whole number from 0 to 125 and a compatible comparison.');
                }
                if ($field !== 'age' && in_array($operator, ['greater_than_or_equal', 'less_than_or_equal'], true)) {
                    $validator->errors()->add('operator', 'This comparison is only supported for age.');
                }
                if ($operator === 'in' && count(array_filter(array_map('trim', explode(',', $value)))) < 2) {
                    $validator->errors()->add('value', 'The “in” operator requires at least two comma-separated values.');
                }
            },
        ];
    }
}
