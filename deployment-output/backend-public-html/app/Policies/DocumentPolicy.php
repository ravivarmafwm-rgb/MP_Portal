<?php

namespace App\Policies;

use App\Models\Citizen;
use App\Models\Document;
use App\Models\Project;
use App\Models\User;
use App\Models\Volunteer;
use App\Models\Grievance;
use App\Models\SchemeApplication;
use App\Services\GeographicScopeService;

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
    public function create(User $user, object $owner): bool
    {
        if ($owner instanceof SchemeApplication && $user->hasRole('citizen')) {
            return $user->citizen_id !== null && $owner->citizen_id === $user->citizen_id;
        }
        return $user->hasPermission('documents.manage') && $this->withinScope($user, $owner);
    }
    public function update(User $user, Document $document): bool { return $user->hasPermission('documents.manage') && $this->withinScope($user, $document->documentable); }
    public function delete(User $user, Document $document): bool { return $user->hasPermission('documents.manage') && $this->withinScope($user, $document->documentable); }

    private function withinScope(User $user, mixed $owner): bool
    {
        if (!$owner) return false;
        if (!($owner instanceof Citizen || $owner instanceof Volunteer || $owner instanceof Project || $owner instanceof Grievance || $owner instanceof SchemeApplication)) return false;

        return app(GeographicScopeService::class)->allows($user, $owner);
    }
}
