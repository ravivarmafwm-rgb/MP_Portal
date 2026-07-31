<?php

namespace App\Services;

use App\Models\Citizen;
use App\Models\Scheme;

class SchemeEligibilityService
{
    public function evaluate(Scheme $scheme, Citizen $citizen): array
    {
        $scheme->loadMissing('eligibilityRules');
        $facts = [
            'age' => $citizen->date_of_birth?->age,
            'gender' => $citizen->gender,
            'disability_status' => $citizen->disability_status,
            'occupation' => $citizen->occupation,
            'marital_status' => $citizen->marital_status,
        ];
        $results = $scheme->eligibilityRules->map(function ($rule) use ($facts) {
            $actual = $facts[$rule->field_name] ?? null;
            $expected = $rule->value;
            $passed = match ($rule->operator) {
                'equals', '=' => (string) $actual === (string) $expected,
                'not_equals', '!=' => (string) $actual !== (string) $expected,
                'greater_than_or_equal', '>=' => is_numeric($actual) && (float) $actual >= (float) $expected,
                'less_than_or_equal', '<=' => is_numeric($actual) && (float) $actual <= (float) $expected,
                'in' => in_array((string) $actual, array_map('trim', explode(',', (string) $expected)), true),
                default => false,
            };
            return [
                'rule_id' => $rule->id,
                'rule_name' => $rule->rule_name,
                'mandatory' => $rule->is_mandatory,
                'passed' => $passed,
                'message' => $passed ? null : ($rule->error_message ?: "{$rule->rule_name} is not satisfied."),
            ];
        })->values()->all();

        return [
            'eligible' => collect($results)->where('mandatory', true)->every('passed'),
            'results' => $results,
        ];
    }
}
