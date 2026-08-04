<?php

namespace App\Policies;

use App\Models\Family;
use App\Models\User;
use App\Services\GeographicScopeService;

class FamilyPolicy
{
    public function before(User $user): ?bool
    {
        return $user->hasRole('super-admin') ? true : null;
    }

    public function viewAny(User $user): bool
    {
        return $user->hasPermission('families.manage');
    }

    public function view(User $user, Family $family): bool
    {
        if ($user->hasRole('citizen')) {
            return $user->citizen_id !== null && $family->citizens()->whereKey($user->citizen_id)->exists();
        }
        return $user->hasPermission('families.manage')
            && app(GeographicScopeService::class)->allows($user, $family);
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('families.manage');
    }

    public function update(User $user, Family $family): bool
    {
        return $this->view($user, $family);
    }

    public function delete(User $user, Family $family): bool
    {
        return $this->view($user, $family);
    }
}
