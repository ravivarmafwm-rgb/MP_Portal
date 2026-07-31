<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CitizenAddressResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'citizen_id' => $this->citizen_id,
            'address_type' => $this->address_type,
            'house_number' => $this->house_number,
            'street' => $this->street,
            'locality' => $this->locality,
            'landmark' => $this->landmark,
            'post_office' => $this->post_office,
            'pincode' => $this->pincode,
            'district' => $this->district,
            'state' => $this->state,
            'country' => $this->country,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'is_primary' => (bool) $this->is_primary,
            'valid_from' => $this->valid_from?->toDateString(),
            'valid_to' => $this->valid_to?->toDateString(),
            'village' => $this->whenLoaded('village'),
            'ward' => $this->whenLoaded('ward'),
            'polling_booth' => $this->whenLoaded('pollingBooth'),
        ];
    }
}
