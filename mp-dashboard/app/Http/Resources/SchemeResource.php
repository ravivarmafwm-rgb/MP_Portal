<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SchemeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id, 'name' => $this->name, 'code' => $this->code,
            'category' => $this->category, 'department_id' => $this->department_id,
            'department' => $this->whenLoaded('department'), 'description' => $this->description,
            'objectives' => $this->objectives, 'eligibility' => $this->eligibility,
            'benefits' => $this->benefits, 'documents_required' => $this->documents_required,
            'max_amount' => $this->max_amount, 'funding_source' => $this->funding_source,
            'start_date' => $this->start_date?->toDateString(), 'end_date' => $this->end_date?->toDateString(),
            'is_active' => $this->is_active, 'application_mode' => $this->application_mode,
            'approval_authority' => $this->approval_authority, 'sla_days' => $this->sla_days,
            'website_url' => $this->website_url, 'helpline_number' => $this->helpline_number,
            'remarks' => $this->remarks,
            'applications_count' => $this->whenCounted('applications'),
            'beneficiaries_count' => $this->whenCounted('beneficiaries'),
            'eligibility_rules' => $this->whenLoaded('eligibilityRules'),
            'created_at' => $this->created_at?->toISOString(), 'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
