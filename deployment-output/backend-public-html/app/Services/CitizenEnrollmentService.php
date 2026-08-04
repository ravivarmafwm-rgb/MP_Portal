<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\Citizen;
use App\Models\CitizenAddress;
use App\Models\Family;
use App\Models\FamilyMember;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class CitizenEnrollmentService
{
    public function create(array $data, User $actor, Request $request, bool $notify = true): Citizen
    {
        $aadhaar = $data['aadhaar_number'] ?? null;
        if ($aadhaar && Citizen::where('aadhaar_hash', hash_hmac('sha256', $aadhaar, config('app.key')))->exists()) {
            throw ValidationException::withMessages(['aadhaar_number' => ['This Aadhaar number is already registered.']]);
        }
        if (!empty($data['mobile_number']) && Citizen::where('mobile_number', $data['mobile_number'])->exists()) {
            throw ValidationException::withMessages(['mobile_number' => ['This mobile number is already registered.']]);
        }
        if (!empty($data['voter_id']) && Citizen::where('voter_id', $data['voter_id'])->exists()) {
            throw ValidationException::withMessages(['voter_id' => ['This voter ID is already registered.']]);
        }
        abort_unless(app(GeographicScopeService::class)->allowsVillage($actor, $data['village_id'], $data['ward_id'] ?? null), 403, 'The selected location is outside your assigned area.');
        if (!empty($data['family_id'])) {
            $family = Family::findOrFail($data['family_id']);
            abort_unless($actor->can('update', $family), 403);
            abort_unless($family->village_id === $data['village_id'], 422, 'The selected family is not in the citizen village.');
        }

        $citizen = DB::transaction(function () use ($data, $actor, $request) {
            $profile = collect($data)->only([
                'first_name', 'last_name', 'middle_name', 'date_of_birth', 'gender',
                'mobile_number', 'alternate_mobile', 'aadhaar_number', 'voter_id',
                'occupation', 'education', 'marital_status', 'father_name', 'mother_name',
                'spouse_name', 'blood_group', 'email', 'is_voter', 'voter_status',
                'disability_status', 'disability_details',
            ])->all();
            $citizen = Citizen::create($profile + [
                'unique_id' => 'CIT'.strtoupper(Str::random(8)),
                'family_id' => $data['family_id'] ?? null,
                'relationship_to_head' => $data['relationship_with_head'] ?? null,
                'created_by' => $actor->id,
            ]);
            CitizenAddress::create([
                'citizen_id'       => $citizen->id,
                'address_type'     => 'permanent',
                'village_id'       => $data['village_id'],
                'ward_id'          => $data['ward_id'] ?? null,
                'polling_booth_id' => $data['polling_booth_id'] ?? null,
                'house_number'     => $data['house_number'] ?? null,
                'street'           => $data['street'] ?? null,
                'locality'         => $data['locality'] ?? null,
                'landmark'         => $data['landmark'] ?? null,
                'pincode'          => $data['pincode'],
                'district'         => $data['district'],
                'state'            => $data['state'],
                'is_primary'       => true,
                'created_by'       => $actor->id,
            ]);
            if (!empty($data['family_id'])) {
                FamilyMember::create([
                    'family_id' => $data['family_id'], 'citizen_id' => $citizen->id,
                    'relationship_with_head' => $data['relationship_with_head'],
                    'is_head' => false, 'date_of_joining_family' => today(), 'created_by' => $actor->id,
                ]);
                $family = Family::lockForUpdate()->findOrFail($data['family_id']);
                $family->update([
                    'members_count' => $family->familyMembers()->count(),
                    'voters_count' => $family->familyMembers()->whereHas('citizen', fn ($q) => $q->where('is_voter', true))->count(),
                    'updated_by' => $actor->id,
                ]);
            }
            ActivityLog::create([
                'user_id' => $actor->id, 'loggable_type' => Citizen::class, 'loggable_id' => $citizen->id,
                'action' => 'citizen_created', 'module' => 'citizens',
                'description' => "Citizen {$citizen->first_name} {$citizen->last_name} ({$citizen->unique_id}) enrolled",
                'new_values' => $citizen->getAttributes(), 'ip_address' => $request->ip(), 'user_agent' => $request->userAgent(),
            ]);
            return $citizen;
        });

        if ($notify) {
            NotificationService::notifyRoles(
                ['mp', 'mla', 'mp-staff', 'constituency-coordinator'],
                'New Citizen Enrolled',
                "{$citizen->first_name} {$citizen->last_name} ({$citizen->unique_id}) was enrolled by {$actor->name}.",
                'citizen',
                '/citizens/list',
                $citizen,
            );
        }
        return $citizen->fresh(['addresses', 'families']);
    }

    public function update(Citizen $citizen, array $data, User $actor, Request $request): Citizen
    {
        return DB::transaction(function () use ($citizen, $data, $actor, $request) {
            $locked = Citizen::lockForUpdate()->findOrFail($citizen->id);
            $old = $locked->getAttributes();
            $locked->update($data + ['updated_by' => $actor->id]);
            if (array_key_exists('is_voter', $data)) {
                foreach ($locked->families()->lockForUpdate()->get() as $family) {
                    $family->update([
                        'voters_count' => $family->familyMembers()->whereHas('citizen', fn ($q) => $q->where('is_voter', true))->count(),
                        'updated_by' => $actor->id,
                    ]);
                }
            }
            ActivityLog::create([
                'user_id' => $actor->id, 'loggable_type' => Citizen::class, 'loggable_id' => $locked->id,
                'action' => 'citizen_updated', 'module' => 'citizens', 'description' => 'Citizen profile updated',
                'old_values' => $old, 'new_values' => $locked->fresh()->getAttributes(),
                'ip_address' => $request->ip(), 'user_agent' => $request->userAgent(),
            ]);
            return $locked->fresh();
        });
    }
}
