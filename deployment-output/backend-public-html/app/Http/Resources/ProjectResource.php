<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'project_number' => $this->project_number,
            'name' => $this->name,
            'project_type' => $this->project_type,
            'category' => $this->category,
            'department' => $this->department,
            'description' => $this->description,
            'objectives' => $this->objectives,
            'status' => $this->status,
            'estimated_cost' => $this->estimated_cost,
            'sanctioned_amount' => $this->sanctioned_amount,
            'expenditure' => $this->expenditure,
            'progress_percentage' => $this->progress_percentage,
            'sanction_date' => $this->sanction_date?->toDateString(),
            'start_date' => $this->start_date?->toDateString(),
            'scheduled_completion_date' => $this->scheduled_completion_date?->toDateString(),
            'actual_completion_date' => $this->actual_completion_date?->toDateString(),
            'location' => $this->location,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'constituency_id' => $this->constituency_id,
            'assembly_constituency_id' => $this->assembly_constituency_id,
            'mandal_id' => $this->mandal_id,
            'village_id' => $this->village_id,
            'ward_id' => $this->ward_id,
            'contractor_id' => $this->contractor_id,
            'project_category_id' => $this->project_category_id,
            'project_type_id' => $this->project_type_id,
            'department_id' => $this->department_id,
            'agency_id' => $this->agency_id,
            'category_lookup' => $this->whenLoaded('projectCategory', fn () => ['id' => $this->projectCategory->id, 'name' => $this->projectCategory->name, 'code' => $this->projectCategory->code]),
            'type' => $this->whenLoaded('projectType', fn () => ['id' => $this->projectType->id, 'name' => $this->projectType->name, 'code' => $this->projectType->code]),
            'department_lookup' => $this->whenLoaded('department', fn () => ['id' => $this->department->id, 'name' => $this->department->name, 'code' => $this->department->code]),
            'agency' => $this->whenLoaded('agency', fn () => ['id' => $this->agency->id, 'name' => $this->agency->name, 'code' => $this->agency->code]),
            'constituency' => $this->whenLoaded('constituency'),
            'assembly_constituency' => $this->whenLoaded('assemblyConstituency'),
            'mandal' => $this->whenLoaded('mandal'),
            'village' => $this->whenLoaded('village'),
            'ward' => $this->whenLoaded('ward'),
            'contractor' => $this->whenLoaded('contractor'),
            'milestones' => $this->whenLoaded('milestones'),
            'updates' => $this->whenLoaded('updates'),
            'budgets' => $this->whenLoaded('budgets'),
            'photos' => $this->whenLoaded('photos'),
        ];
    }
}
