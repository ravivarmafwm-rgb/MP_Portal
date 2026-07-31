<?php

namespace App\Http\Requests\Survey;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SaveSurveyRequest extends FormRequest
{
    private const VALIDATIONS = [
        'short_text' => ['min_length', 'max_length'],
        'long_text' => ['min_length', 'max_length'],
        'number' => ['min', 'max'],
        'date' => ['after', 'before'],
        'checkbox' => ['min_selections', 'max_selections'],
    ];

    public function authorize(): bool
    {
        return $this->user()?->hasPermission('surveys.manage') ?? false;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'category' => ['required', Rule::in(['employment', 'farmer', 'housing', 'water', 'health', 'education', 'census', 'general'])],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'target_responses' => ['nullable', 'integer', 'min:1', 'max:10000000'],
            'require_authentication' => ['required', 'boolean'],
            'instructions' => ['nullable', 'string', 'max:5000'],
            'language' => ['required', 'string', 'max:10'],
            'village_id' => ['nullable', 'uuid', 'exists:villages,id'],
            'questions' => ['required', 'array', 'min:1', 'max:100'],
            'questions.*.id' => ['nullable', 'uuid'],
            'questions.*.question_text' => ['required', 'string', 'max:2000'],
            'questions.*.question_type' => ['required', Rule::in(['short_text', 'long_text', 'number', 'dropdown', 'radio', 'checkbox', 'date', 'rating', 'file_upload', 'gps_location', 'mobile'])],
            'questions.*.options' => ['nullable', 'array', 'max:50'],
            'questions.*.options.*' => ['string', 'max:255', 'distinct'],
            'questions.*.is_required' => ['required', 'boolean'],
            'questions.*.validation_rule' => ['nullable', 'string', 'max:255'],
            'questions.*.help_text' => ['nullable', 'string', 'max:1000'],
            'questions.*.category' => ['nullable', 'string', 'max:100'],
        ];
    }

    public function after(): array
    {
        return [function ($validator) {
            foreach ($this->input('questions', []) as $index => $question) {
                $type = $question['question_type'] ?? '';
                $options = $question['options'] ?? [];
                if (in_array($type, ['dropdown', 'radio', 'checkbox'], true) && count($options) < 2) {
                    $validator->errors()->add("questions.{$index}.options", 'At least two options are required.');
                }

                $parsed = $this->parseValidationRules((string) ($question['validation_rule'] ?? ''));
                foreach ($parsed['errors'] as $error) {
                    $validator->errors()->add("questions.{$index}.validation_rule", $error);
                }
                foreach ($parsed['rules'] as $name => $value) {
                    if (!in_array($name, self::VALIDATIONS[$type] ?? [], true)) {
                        $validator->errors()->add("questions.{$index}.validation_rule", "The {$name} validation is not supported for {$type} questions.");
                        continue;
                    }
                    if (in_array($name, ['min_length', 'max_length', 'min_selections', 'max_selections'], true)
                        && (!ctype_digit($value) || (int) $value < 0 || (int) $value > 5000)) {
                        $validator->errors()->add("questions.{$index}.validation_rule", "The {$name} value must be an integer between 0 and 5000.");
                    }
                    if (in_array($name, ['min', 'max'], true) && !is_numeric($value)) {
                        $validator->errors()->add("questions.{$index}.validation_rule", "The {$name} value must be numeric.");
                    }
                    if (in_array($name, ['after', 'before'], true) && !$this->isIsoDate($value)) {
                        $validator->errors()->add("questions.{$index}.validation_rule", "The {$name} value must be a valid YYYY-MM-DD date.");
                    }
                }
                $this->validateBounds($validator, $index, $parsed['rules']);
            }
        }];
    }

    private function parseValidationRules(string $value): array
    {
        $rules = [];
        $errors = [];
        foreach (array_filter(explode('|', trim($value))) as $part) {
            if (!preg_match('/^([a-z_]+):(.+)$/', $part, $matches)) {
                $errors[] = 'Validation rules must use name:value syntax.';
                continue;
            }
            if (array_key_exists($matches[1], $rules)) {
                $errors[] = "The {$matches[1]} validation may only be specified once.";
                continue;
            }
            $rules[$matches[1]] = trim($matches[2]);
        }

        return ['rules' => $rules, 'errors' => $errors];
    }

    private function validateBounds($validator, int $index, array $rules): void
    {
        foreach ([['min_length', 'max_length'], ['min_selections', 'max_selections'], ['min', 'max'], ['after', 'before']] as [$minimum, $maximum]) {
            if (isset($rules[$minimum], $rules[$maximum]) && $rules[$minimum] > $rules[$maximum]) {
                $validator->errors()->add("questions.{$index}.validation_rule", "{$minimum} cannot be greater than {$maximum}.");
            }
        }
    }

    private function isIsoDate(string $value): bool
    {
        $date = \DateTimeImmutable::createFromFormat('!Y-m-d', $value);

        return $date !== false && $date->format('Y-m-d') === $value;
    }
}
