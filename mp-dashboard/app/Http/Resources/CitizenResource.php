<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CitizenResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                  => $this->id,
            'unique_id'           => $this->unique_id,
            'first_name'          => $this->first_name,
            'middle_name'         => $this->middle_name,
            'last_name'           => $this->last_name,
            'date_of_birth'       => $this->date_of_birth?->toDateString(),
            'gender'              => $this->gender,
            'mobile_number'       => $this->mobile_number,
            'alternate_mobile'    => $this->alternate_mobile,
            'email'               => $this->email,
            'voter_id'            => $this->voter_id,
            'aadhaar_masked'      => $this->aadhaar_masked,
            'occupation'          => $this->occupation,
            'education'           => $this->education,
            'marital_status'      => $this->marital_status,
            'father_name'         => $this->father_name,
            'mother_name'         => $this->mother_name,
            'spouse_name'         => $this->spouse_name,
            'blood_group'         => $this->blood_group,
            'is_voter'            => (bool) $this->is_voter,
            'voter_status'        => $this->voter_status,
            'disability_status'   => $this->disability_status,
            'disability_details'  => $this->disability_details,
            'is_deceased'         => (bool) $this->is_deceased,
            'date_of_death'       => $this->date_of_death?->toDateString(),
            'addresses'           => self::whenLoaded('addresses'),
            'families'            => self::whenLoaded('families'),
            'family'             => self::whenLoaded('family'),
            'relationship_to_head' => $this->relationship_to_head,
            'grievances'          => self::whenLoaded('grievances'),
            'scheme_applications' => self::whenLoaded('schemeApplications'),
            'scheme_beneficiaries'=> self::whenLoaded('schemeBeneficiaries'),
            'survey_responses'    => self::whenLoaded('surveyResponses'),
            'appointments'        => self::whenLoaded('appointments'),
            'volunteer_visits'    => self::whenLoaded('volunteerVisits'),
            'interactions'        => self::whenLoaded('interactions'),
            'documents'           => self::whenLoaded('documents'),
            'activity_logs'       => self::whenLoaded('activityLogs'),
            'related_projects'    => $this->when(isset($this->related_projects), $this->related_projects),
        ];
    }
}
