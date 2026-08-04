<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\Citizen;
use App\Models\Family;
use App\Models\FamilyMember;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class FamilyService
{
    public function create(array $data, User $actor, Request $request): Family
    {
        return DB::transaction(function () use ($data, $actor, $request) {
            $head = $this->availableCitizen($data['head_citizen_id'], $actor, 'citizen_id');
            $this->assertLocation($actor, $data['village_id'], $data['ward_id'] ?? null);
            if (!empty($data['house_number']) && Family::where('village_id', $data['village_id'])
                ->whereRaw('LOWER(TRIM(house_number)) = ?', [mb_strtolower(trim($data['house_number']))])->exists()) {
                throw ValidationException::withMessages(['house_number' => ['A family is already registered for this house in the selected village.']]);
            }
            $family = Family::create($this->familyAttributes($data) + [
                'family_id' => 'FAM'.strtoupper(Str::random(8)),
                'head_citizen_id' => $head->id,
                'head_of_family_name' => $this->citizenName($head),
                'members_count' => 1,
                'voters_count' => $head->is_voter ? 1 : 0,
                'created_by' => $actor->id,
            ]);
            FamilyMember::create([
                'family_id' => $family->id,
                'citizen_id' => $head->id,
                'relationship_with_head' => 'Self',
                'is_head' => true,
                'date_of_joining_family' => today(),
                'created_by' => $actor->id,
            ]);
            $head->update(['family_id' => $family->id, 'relationship_to_head' => 'Self', 'updated_by' => $actor->id]);
            $this->audit($family, $actor, $request, 'family_created', null, $family->getAttributes());
            return $family->fresh($this->relations());
        });
    }

    public function update(Family $family, array $data, User $actor, Request $request): Family
    {
        return DB::transaction(function () use ($family, $data, $actor, $request) {
            $locked = Family::lockForUpdate()->findOrFail($family->id);
            $old = $locked->getAttributes();
            if (isset($data['village_id']) || array_key_exists('ward_id', $data)) {
                $this->assertLocation($actor, $data['village_id'] ?? $locked->village_id, $data['ward_id'] ?? $locked->ward_id);
            }
            if (!empty($data['head_citizen_id'])) {
                $head = Citizen::findOrFail($data['head_citizen_id']);
                abort_unless(app(GeographicScopeService::class)->allows($actor, $head), 403);
                $member = $locked->familyMembers()->where('citizen_id', $head->id)->first();
                if (!$member) throw ValidationException::withMessages(['head_citizen_id' => ['The head must already be a member of this family.']]);
                $locked->familyMembers()->update(['is_head' => false, 'updated_by' => $actor->id]);
                $member->update(['is_head' => true, 'relationship_with_head' => 'Self', 'updated_by' => $actor->id]);
                $locked->head_citizen_id = $head->id;
                $locked->save();
                $locked->citizens()->whereKeyNot($head->id)->update(['relationship_to_head' => 'Member', 'updated_by' => $actor->id]);
                $head->update(['family_id' => $locked->id, 'relationship_to_head' => 'Self', 'updated_by' => $actor->id]);
                $data['head_of_family_name'] = $this->citizenName($head);
            }
            unset($data['head_citizen_id']);
            $locked->update($this->familyAttributes($data) + ['updated_by' => $actor->id]);
            $this->syncCounts($locked);
            $this->audit($locked, $actor, $request, 'family_updated', $old, $locked->fresh()->getAttributes());
            return $locked->fresh($this->relations());
        });
    }

    public function addMember(Family $family, array $data, User $actor, Request $request): Family
    {
        return DB::transaction(function () use ($family, $data, $actor, $request) {
            $locked = Family::lockForUpdate()->findOrFail($family->id);
            $citizen = $this->availableCitizen($data['citizen_id'], $actor);
            abort_unless($citizen->addresses()->where('village_id', $locked->village_id)->exists(), 422, 'Citizen must have an address in the family village.');
            if ($data['is_head'] ?? false) {
                $locked->familyMembers()->update(['is_head' => false, 'updated_by' => $actor->id]);
                $locked->citizens()->whereKeyNot($citizen->id)->update(['relationship_to_head' => 'Member', 'updated_by' => $actor->id]);
                $locked->update(['head_of_family_name' => $this->citizenName($citizen), 'updated_by' => $actor->id]);
            }
            FamilyMember::create($data + ['family_id' => $locked->id, 'created_by' => $actor->id]);
            $citizen->update(['family_id' => $locked->id, 'relationship_to_head' => ($data['is_head'] ?? false) ? 'Self' : $data['relationship_with_head'], 'updated_by' => $actor->id]);
            if ($data['is_head'] ?? false) $locked->update(['head_citizen_id' => $citizen->id]);
            $this->syncCounts($locked);
            $this->audit($locked, $actor, $request, 'family_member_added', null, ['citizen_id' => $citizen->id]);
            return $locked->fresh($this->relations());
        });
    }

    public function removeMember(Family $family, FamilyMember $member, User $actor, Request $request): Family
    {
        return DB::transaction(function () use ($family, $member, $actor, $request) {
            $locked = Family::lockForUpdate()->findOrFail($family->id);
            abort_unless($member->family_id === $locked->id, 404);
            if ($member->is_head) throw ValidationException::withMessages(['member' => ['Assign another head before removing the current head.']]);
            $citizenId = $member->citizen_id;
            $member->forceDelete();
            $member->citizen()->update(['family_id' => null, 'relationship_to_head' => null, 'updated_by' => $actor->id]);
            $this->syncCounts($locked);
            $this->audit($locked, $actor, $request, 'family_member_removed', ['citizen_id' => $citizenId], null);
            return $locked->fresh($this->relations());
        });
    }

    public function updateMember(Family $family, FamilyMember $member, array $data, User $actor, Request $request): Family
    {
        return DB::transaction(function () use ($family, $member, $data, $actor, $request) {
            $locked = Family::lockForUpdate()->findOrFail($family->id);
            abort_unless($member->family_id === $locked->id, 404);
            abort_unless($data['citizen_id'] === $member->citizen_id, 422, 'A family membership cannot be reassigned to another citizen.');
            if ($member->is_head && array_key_exists('is_head', $data) && !$data['is_head']) {
                throw ValidationException::withMessages(['is_head' => ['Assign another member as head instead of removing the current head flag.']]);
            }
            if ($data['is_head'] ?? false) {
                $locked->familyMembers()->where('id', '<>', $member->id)->update(['is_head' => false, 'updated_by' => $actor->id]);
                $locked->citizens()->whereKeyNot($member->citizen_id)->update(['relationship_to_head' => 'Member', 'updated_by' => $actor->id]);
                $citizen = $member->citizen()->firstOrFail();
                $locked->update(['head_of_family_name' => $this->citizenName($citizen), 'updated_by' => $actor->id]);
                $data['relationship_with_head'] = 'Self';
                $locked->update(['head_citizen_id' => $member->citizen_id]);
            }
            $old = $member->getAttributes();
            $member->update($data + ['updated_by' => $actor->id]);
            $member->citizen()->update(['family_id' => $locked->id, 'relationship_to_head' => $data['relationship_with_head'], 'updated_by' => $actor->id]);
            $this->audit($locked, $actor, $request, 'family_member_updated', $old, $member->fresh()->getAttributes());
            return $locked->fresh($this->relations());
        });
    }

    private function availableCitizen(string $id, User $actor, string $field = 'citizen_id'): Citizen
    {
        $citizen = Citizen::findOrFail($id);
        abort_unless(app(GeographicScopeService::class)->allows($actor, $citizen), 403);
        if (FamilyMember::where('citizen_id', $id)->whereNull('deleted_at')->exists() || Citizen::whereKey($id)->whereNotNull('family_id')->exists()) {
            throw ValidationException::withMessages([$field => ['This citizen already belongs to a family.']]);
        }
        return $citizen;
    }

    private function assertLocation(User $actor, string $villageId, ?string $wardId): void
    {
        abort_unless(app(GeographicScopeService::class)->allowsVillage($actor, $villageId, $wardId), 403, 'The selected location is outside your assigned area.');
    }

    private function familyAttributes(array $data): array
    {
        return collect($data)->except(['head_citizen_id'])->only((new Family)->getFillable())->all();
    }

    private function syncCounts(Family $family): void
    {
        $family->update([
            'members_count' => $family->familyMembers()->count(),
            'voters_count' => $family->familyMembers()->whereHas('citizen', fn ($q) => $q->where('is_voter', true))->count(),
        ]);
    }

    private function audit(Family $family, User $actor, Request $request, string $action, ?array $old, ?array $new): void
    {
        ActivityLog::create([
            'user_id' => $actor->id, 'loggable_type' => Family::class, 'loggable_id' => $family->id,
            'action' => $action, 'module' => 'families', 'description' => str_replace('_', ' ', ucfirst($action)),
            'old_values' => $old, 'new_values' => $new, 'ip_address' => $request->ip(), 'user_agent' => $request->userAgent(),
        ]);
    }

    private function relations(): array
    {
        return ['village.mandal', 'ward', 'pollingBooth', 'head', 'familyMembers.citizen'];
    }

    private function citizenName(Citizen $citizen): string
    {
        return collect([$citizen->first_name, $citizen->middle_name, $citizen->last_name])->filter()->join(' ');
    }
}
