<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\Survey;
use App\Models\SurveyResponse;
use App\Models\Volunteer;
use App\Models\Ward;
use Carbon\CarbonImmutable;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class SurveyResponseService
{
    public function submit(Survey $survey, array $data, array $files, $user, string $ip, ?string $agent): SurveyResponse
    {
        if (!empty($data['client_submission_id'])) {
            $existing = $survey->responses()->where('client_submission_id', $data['client_submission_id'])->first();
            if ($existing) {
                abort_unless($existing->created_by === $user->id, 409, 'The submission identifier is already in use.');
                return $existing->load('responseDetails');
            }
        }

        $collectedAt = isset($data['collected_at']) ? CarbonImmutable::parse($data['collected_at']) : now()->toImmutable();
        $offline = (bool) ($data['submitted_offline'] ?? false);
        $withinCollectionDates = !$collectedAt->startOfDay()->isBefore($survey->start_date)
            && (!$survey->end_date || !$collectedAt->startOfDay()->isAfter($survey->end_date));
        abort_unless($withinCollectionDates, 409, 'The response was collected outside the survey period.');
        if ($survey->status !== 'active' || !$survey->is_active) {
            $withinSyncGrace = $offline && $survey->status === 'closed' && $survey->end_date && now()->lte($survey->end_date->copy()->endOfDay()->addDays(7));
            abort_unless($withinSyncGrace, 409, 'This survey is not accepting responses.');
        }

        abort_unless(app(GeographicScopeService::class)->allowsVillage($user, $data['village_id'], $data['ward_id'] ?? null), 403);
        if (!empty($data['ward_id']) && !Ward::whereKey($data['ward_id'])->where('village_id', $data['village_id'])->exists()) {
            throw ValidationException::withMessages(['ward_id' => ['The ward does not belong to the selected village.']]);
        }
        if ($survey->require_authentication && empty($data['citizen_id'])) {
            throw ValidationException::withMessages(['citizen_id' => ['A citizen is required for this survey.']]);
        }
        if (!empty($data['citizen_id']) && $survey->responses()->where('citizen_id', $data['citizen_id'])->exists()) {
            throw ValidationException::withMessages(['citizen_id' => ['This citizen already has a response for the survey.']]);
        }

        $volunteer = Volunteer::where('user_id', $user->id)->first();
        if ($volunteer && $survey->assignments()->exists() && !$survey->assignments()->where('volunteer_id', $volunteer->id)->whereIn('status', ['assigned', 'in_progress'])->exists()) {
            abort(403, 'This survey is not assigned to the volunteer.');
        }

        $questions = $survey->questions()->orderBy('sort_order')->get();
        $answers = $data['answers'] ?? [];
        $visibleQuestions = $questions->filter(fn ($question) => $this->isQuestionVisible($question, $answers));
        $this->validateAnswers($visibleQuestions, $answers, $files);
        $stored = [];

        try {
            return DB::transaction(function () use ($survey, $data, $files, $user, $volunteer, $questions, $visibleQuestions, $answers, &$stored, $ip, $agent, $collectedAt, $offline) {
                $response = SurveyResponse::create([
                    'survey_id' => $survey->id,
                    'client_submission_id' => $data['client_submission_id'] ?? null,
                    'citizen_id' => $data['citizen_id'] ?? null,
                    'volunteer_id' => $volunteer?->id,
                    'village_id' => $data['village_id'],
                    'ward_id' => $data['ward_id'] ?? null,
                    'respondent_name' => $data['respondent_name'] ?? null,
                    'respondent_mobile' => $data['respondent_mobile'] ?? null,
                    'response_date' => $collectedAt->toDateString(),
                    'response_time' => $collectedAt->format('H:i:s'),
                    'collected_at' => $collectedAt,
                    'submitted_offline' => $offline,
                    'latitude' => $data['latitude'] ?? null,
                    'longitude' => $data['longitude'] ?? null,
                    'status' => 'completed',
                    'remarks' => $data['remarks'] ?? null,
                    'created_by' => $user->id,
                ]);
                foreach ($questions as $question) {
                    if (!$visibleQuestions->contains('id', $question->id)) {
                        continue;
                    }
                    $attachment = null;
                    if (isset($files[$question->id]) && $files[$question->id] instanceof UploadedFile) {
                        $attachment = $files[$question->id]->storeAs("surveys/{$survey->id}/responses/{$response->id}", Str::uuid().'.'.$files[$question->id]->extension(), 'local');
                        $stored[] = $attachment;
                    }
                    $value = $answers[$question->id] ?? null;
                    $response->responseDetails()->create([
                        'survey_question_id' => $question->id,
                        'answer' => is_array($value) ? json_encode($value, JSON_THROW_ON_ERROR) : $value,
                        'answer_type' => $question->question_type,
                        'attachment' => $attachment,
                        'sort_order' => $question->sort_order,
                        'created_by' => $user->id,
                    ]);
                }
                $survey->increment('total_responses');
                if ($volunteer) $survey->assignments()->where('volunteer_id', $volunteer->id)->update(['status' => 'in_progress', 'completed_responses' => DB::raw('completed_responses + 1')]);
                ActivityLog::create([
                    'user_id' => $user->id, 'loggable_type' => SurveyResponse::class, 'loggable_id' => $response->id,
                    'action' => $offline ? 'offline_response_synced' : 'submitted', 'module' => 'surveys',
                    'description' => $offline ? 'Offline survey response synchronized' : 'Survey response submitted',
                    'new_values' => ['survey_id' => $survey->id, 'village_id' => $data['village_id'], 'collected_at' => $collectedAt->toIso8601String()],
                    'ip_address' => $ip, 'user_agent' => $agent,
                ]);
                return $response->load('responseDetails');
            });
        } catch (\Throwable $exception) {
            foreach ($stored as $path) Storage::disk('local')->delete($path);
            if (!empty($data['client_submission_id'])) {
                $existing = $survey->responses()->where('client_submission_id', $data['client_submission_id'])->first();
                if ($existing && $existing->created_by === $user->id) return $existing->load('responseDetails');
            }
            throw $exception;
        }
    }

    /**
     * Evaluate persisted branching rules server-side so hidden questions are
     * never required or persisted from an untrusted client submission.
     */
    private function isQuestionVisible($question, array $answers): bool
    {
        $rules = is_array($question->branching_rules) ? $question->branching_rules : [];
        if ($rules === []) return true;

        foreach ($rules as $rule) {
            $source = $answers[$rule['when_question_id'] ?? ''] ?? null;
            $expected = $rule['value'] ?? null;
            $operator = $rule['operator'] ?? 'equals';
            $matched = match ($operator) {
                'contains' => is_array($source) ? in_array($expected, $source, true) : str_contains((string) $source, (string) $expected),
                'not_equals' => $source != $expected,
                default => is_array($source) ? in_array($expected, $source, true) : (string) $source === (string) $expected,
            };

            if ($matched) {
                return ($rule['action'] ?? 'show') !== 'hide';
            }
        }

        return true;
    }

    private function validateAnswers($questions, array $answers, array $files): void
    {
        $errors = [];
        foreach ($questions as $question) {
            $value = $answers[$question->id] ?? null;
            $empty = $value === null || $value === '' || $value === [];
            $file = $files[$question->id] ?? null;
            if ($question->is_required && $empty && !$file) $errors["answers.{$question->id}"][] = 'This question is required.';
            if ($empty) continue;
            $options = $question->options ?? [];
            switch ($question->question_type) {
                case 'number': if (!is_numeric($value)) $errors["answers.{$question->id}"][] = 'Enter a valid number.'; break;
                case 'rating': if (!is_numeric($value) || (int) $value < 1 || (int) $value > 5) $errors["answers.{$question->id}"][] = 'Rating must be between 1 and 5.'; break;
                case 'date': if (!is_string($value) || strtotime($value) === false) $errors["answers.{$question->id}"][] = 'Enter a valid date.'; break;
                case 'mobile': if (!preg_match('/^[6-9][0-9]{9}$/', (string) $value)) $errors["answers.{$question->id}"][] = 'Enter a valid Indian mobile number.'; break;
                case 'dropdown': case 'radio': if (!in_array($value, $options, true)) $errors["answers.{$question->id}"][] = 'Select a valid option.'; break;
                case 'checkbox': if (!is_array($value) || array_diff($value, $options)) $errors["answers.{$question->id}"][] = 'Select valid options.'; break;
                case 'gps_location': if (!is_array($value) || !isset($value['latitude'], $value['longitude'])) $errors["answers.{$question->id}"][] = 'Capture a valid GPS location.'; break;
            }
            $this->applyPersistedRules($question, $value, $errors);
        }
        if ($errors) throw ValidationException::withMessages($errors);
    }

    private function applyPersistedRules($question, mixed $value, array &$errors): void
    {
        $key = "answers.{$question->id}";
        foreach (array_filter(explode('|', (string) $question->validation_rule)) as $rule) {
            [$name, $argument] = array_pad(explode(':', $rule, 2), 2, null);
            switch ($name) {
                case 'min_length':
                    if (mb_strlen((string) $value) < (int) $argument) $errors[$key][] = "Enter at least {$argument} characters.";
                    break;
                case 'max_length':
                    if (mb_strlen((string) $value) > (int) $argument) $errors[$key][] = "Enter no more than {$argument} characters.";
                    break;
                case 'min':
                    if (is_numeric($value) && (float) $value < (float) $argument) $errors[$key][] = "Enter a value of at least {$argument}.";
                    break;
                case 'max':
                    if (is_numeric($value) && (float) $value > (float) $argument) $errors[$key][] = "Enter a value no greater than {$argument}.";
                    break;
                case 'after':
                    if (is_string($value) && $value <= $argument) $errors[$key][] = "Enter a date after {$argument}.";
                    break;
                case 'before':
                    if (is_string($value) && $value >= $argument) $errors[$key][] = "Enter a date before {$argument}.";
                    break;
                case 'min_selections':
                    if (is_array($value) && count($value) < (int) $argument) $errors[$key][] = "Select at least {$argument} options.";
                    break;
                case 'max_selections':
                    if (is_array($value) && count($value) > (int) $argument) $errors[$key][] = "Select no more than {$argument} options.";
                    break;
            }
        }
    }
}
