<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FamilyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'family_id' => $this->family_id,
            'head_of_family_name' => $this->head_of_family_name,
            'head_citizen_id' => $this->head_citizen_id,
            'head' => self::whenLoaded('head'),
            'citizens' => self::whenLoaded('citizens'),
            'village' => $this->whenLoaded('village'),
            'ward' => $this->whenLoaded('ward'),
            'polling_booth' => $this->whenLoaded('pollingBooth'),
            'house_number' => $this->house_number,
            'street' => $this->street,
            'locality' => $this->locality,
            'members_count' => (int) $this->members_count,
            'voters_count' => (int) $this->voters_count,
            'ration_card_number' => $this->ration_card_number,
            'ration_card_type' => $this->ration_card_type,
            'annual_income' => $this->annual_income,
            'economic_status' => $this->economic_status,
            'caste' => $this->caste,
            'religion' => $this->religion,
            'is_bpl' => (bool) $this->is_bpl,
            'remarks' => $this->remarks,
            'family_members' => self::whenLoaded('familyMembers'),
            'activity_logs' => self::whenLoaded('activityLogs'),
            'documents' => self::whenLoaded('documents'),
            'scheme_beneficiaries' => self::whenLoaded('schemeBeneficiaries'),
            'total_benefits_received' => $this->when(isset($this->total_benefits_received), $this->total_benefits_received),
        ];
    }
}
