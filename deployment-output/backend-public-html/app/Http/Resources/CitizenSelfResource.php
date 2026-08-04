<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CitizenSelfResource extends JsonResource
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
            'aadhaar_masked' => $this->aadhaar_masked,
            'voter_id' => $this->voter_id,
            'family_id' => $this->family_id,
            'relationship_to_head' => $this->relationship_to_head,
            'family' => $this->whenLoaded('family', function () {
                return [
                    'id' => $this->family->id,
                    'family_id' => $this->family->family_id,
                    'head_citizen_id' => $this->family->head_citizen_id,
                    'head_of_family_name' => $this->family->head_of_family_name,
                    'members_count' => (int) $this->family->members_count,
                    'members' => $this->family->citizens->map(fn ($member) => [
                        'id' => $member->id,
                        'unique_id' => $member->unique_id,
                        'name' => trim(implode(' ', array_filter([$member->first_name, $member->middle_name, $member->last_name]))),
                        'relationship_to_head' => $member->relationship_to_head,
                        'gender' => $member->gender,
                        'date_of_birth' => $member->date_of_birth?->toDateString(),
                    ])->values(),
                ];
            }),
            'primary_address' => $this->whenLoaded('addresses', function () {
                $address = $this->addresses->firstWhere('is_primary', true) ?? $this->addresses->first();

                return $address ? [
                    'house_number' => $address->house_number,
                    'street' => $address->street,
                    'locality' => $address->locality,
                    'pincode' => $address->pincode,
                    'village' => $address->village?->name,
                    'ward' => $address->ward?->name,
                ] : null;
            }),
            'counts' => [
                'grievances' => $this->grievances_count ?? 0,
                'scheme_applications' => $this->scheme_applications_count ?? 0,
                'survey_responses' => $this->survey_responses_count ?? 0,
                'documents' => $this->documents_count ?? 0,
            ],
        ];
    }
}
