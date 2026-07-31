<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CitizenBoothResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $address = $this->addresses->firstWhere('is_primary', true) ?? $this->addresses->first();
        return ['id' => $this->id, 'unique_id' => $this->unique_id, 'name' => trim("{$this->first_name} {$this->middle_name} {$this->last_name}"), 'mobile_number' => $this->mobile_number,
            'address' => $address ? ['id' => $address->id, 'village_id' => $address->village_id, 'village' => $address->village?->name, 'ward' => $address->ward?->name,
                'polling_booth' => $address->pollingBooth ? ['id' => $address->pollingBooth->id, 'name' => $address->pollingBooth->name, 'booth_number' => $address->pollingBooth->booth_number] : null] : null];
    }
}
