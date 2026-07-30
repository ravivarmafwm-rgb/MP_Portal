<?php

namespace App\Policies;

use App\Models\Citizen;
use App\Models\Document;
use App\Models\Project;
use App\Models\User;
use App\Models\Volunteer;

class DocumentPolicy
{
    public function before(User $user): ?bool { return $user->hasRole('super-admin') ? true : null; }
    public function viewAny(User $user): bool { return $user->hasPermission('documents.view'); }
    public function view(User $user, Document $document): bool
    {
        if ($document->created_by === $user->id) return true;
        if (!$user->hasPermission('documents.view')) return false;
        return $this->withinScope($user, $document->documentable);
    }
    public function create(User $user, object $owner): bool { return $user->hasPermission('documents.manage') && $this->withinScope($user, $owner); }
    public function delete(User $user, Document $document): bool { return $user->hasPermission('documents.manage') && $this->withinScope($user, $document->documentable); }

    private function withinScope(User $user, mixed $owner): bool
    {
        if (!$owner) return false;
        if ($owner instanceof Citizen) {
            if (!$user->village_id && !$user->ward_id) return true;
            return $owner->addresses()->where($user->ward_id ? 'ward_id' : 'village_id', $user->ward_id ?: $user->village_id)->exists();
        }
        if ($owner instanceof Volunteer) {
            return (!$user->village_id || $owner->village_id === $user->village_id) && (!$user->ward_id || $owner->ward_id === $user->ward_id);
        }
        if ($owner instanceof Project) {
            foreach (['constituency_id', 'assembly_constituency_id', 'mandal_id', 'village_id', 'ward_id'] as $field) if ($user->{$field} && $owner->{$field} !== $user->{$field}) return false;
            return true;
        }
        return false;
    }
}
