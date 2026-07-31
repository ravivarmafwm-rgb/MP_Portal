<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SurveyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $survey = parent::toArray($request);

        if ($this->resource->relationLoaded('lifecycleLogs')) {
            unset($survey['lifecycle_logs']);
            $survey['lifecycle'] = $this->lifecycleLogs->map(fn ($log) => [
                'id' => $log->id,
                'action' => $log->action,
                'description' => $log->description,
                'occurred_at' => $log->created_at?->toIso8601String(),
                'actor' => $log->user ? [
                    'id' => $log->user->id,
                    'name' => $log->user->name,
                    'role' => $log->user->role?->name,
                ] : null,
            ])->values();
        }

        return $survey;
    }
}
