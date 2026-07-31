<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\Citizen;
use App\Models\CitizenAddress;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CitizenAddressService
{
    public function create(Citizen $citizen, array $data, User $actor, Request $request): CitizenAddress
    {
        return DB::transaction(function () use ($citizen, $data, $actor, $request) {
            $this->assertGeography($data, $actor);
            $this->assertRelationships($data);
            if (($data['is_primary'] ?? false) === true) {
                $citizen->addresses()->whereNull('deleted_at')->update(['is_primary' => false, 'updated_by' => $actor->id]);
            }
            $address = $citizen->addresses()->create($data + ['created_by' => $actor->id, 'updated_by' => $actor->id]);
            $this->audit($citizen, 'citizen_address_created', $address->getAttributes(), null, $actor, $request);
            return $address->load(['village', 'ward', 'pollingBooth']);
        });
    }

    public function update(CitizenAddress $address, array $data, User $actor, Request $request): CitizenAddress
    {
        return DB::transaction(function () use ($address, $data, $actor, $request) {
            $this->assertGeography($data, $actor);
            $this->assertRelationships($data);
            $old = $address->getAttributes();
            if (($data['is_primary'] ?? false) === true) {
                $address->citizen->addresses()->whereKeyNot($address->id)->whereNull('deleted_at')->update(['is_primary' => false, 'updated_by' => $actor->id]);
            }
            $address->update($data + ['updated_by' => $actor->id]);
            $this->audit($address->citizen, 'citizen_address_updated', $address->fresh()->getAttributes(), $old, $actor, $request);
            return $address->fresh(['village', 'ward', 'pollingBooth']);
        });
    }

    public function archive(CitizenAddress $address, User $actor, Request $request): void
    {
        DB::transaction(function () use ($address, $actor, $request) {
            if ($address->is_primary && ! $address->citizen->addresses()->whereKeyNot($address->id)->whereNull('deleted_at')->exists()) {
                throw ValidationException::withMessages(['address' => ['The primary address cannot be archived until another address is selected as primary.']]);
            }
            $old = $address->getAttributes();
            $address->delete();
            $this->audit($address->citizen, 'citizen_address_archived', null, $old, $actor, $request);
        });
    }

    private function assertGeography(array $data, User $actor): void
    {
        if (!empty($data['village_id'])) {
            abort_unless(app(GeographicScopeService::class)->allowsVillage($actor, $data['village_id'], $data['ward_id'] ?? null), 403, 'The address is outside your assigned area.');
        }
    }

    private function assertRelationships(array $data): void
    {
        if (!empty($data['ward_id']) && !empty($data['village_id'])) {
            $ward = \App\Models\Ward::findOrFail($data['ward_id']);
            abort_unless($ward->village_id === $data['village_id'], 422, 'The ward does not belong to the selected village.');
        }
        if (!empty($data['polling_booth_id']) && !empty($data['ward_id'])) {
            $booth = \App\Models\PollingBooth::findOrFail($data['polling_booth_id']);
            abort_unless($booth->ward_id === $data['ward_id'], 422, 'The polling booth does not belong to the selected ward.');
        }
    }

    private function audit(Citizen $citizen, string $action, ?array $new, ?array $old, User $actor, Request $request): void
    {
        ActivityLog::create([
            'user_id' => $actor->id, 'loggable_type' => Citizen::class, 'loggable_id' => $citizen->id,
            'action' => $action, 'module' => 'citizens', 'description' => str_replace('_', ' ', $action),
            'old_values' => $old, 'new_values' => $new, 'ip_address' => $request->ip(), 'user_agent' => $request->userAgent(),
        ]);
    }
}
