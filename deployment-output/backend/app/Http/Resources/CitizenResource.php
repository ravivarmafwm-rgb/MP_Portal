<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CitizenResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'unique_id' => $this->unique_id,
            'first_name' => $this->first_name,
            'middle_name' => $this->middle_name,
            'last_name' => $this->last_name,
            'date_of_birth' => $this->date_of_birth?->toDateString(),
            'gender' => $this->gender,
            'mobile_number' => $this->mobile_number,
            'email' => $this->email,
            'voter_id' => $this->voter_id,
            'aadhaar_masked' => $this->aadhaar_masked,
            'occupation' => $this->occupation,
            'education' => $this->education,
            'is_voter' => (bool) $this->is_voter,
            'addresses' => self::whenLoaded('addresses'),
            'families' => self::whenLoaded('families'),
            'grievances' => self::whenLoaded('grievances'),
            'scheme_applications' => self::whenLoaded('schemeApplications'),
            'scheme_beneficiaries' => self::whenLoaded('schemeBeneficiaries'),
            'survey_responses' => self::whenLoaded('surveyResponses'),
            'appointments' => self::whenLoaded('appointments'),
            'documents' => self::whenLoaded('documents'),
            'activity_logs' => self::whenLoaded('activityLogs'),
            'related_projects' => $this->when(isset($this->related_projects), $this->related_projects),
        ];
    }
}
