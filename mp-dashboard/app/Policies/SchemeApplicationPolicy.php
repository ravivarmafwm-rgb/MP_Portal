<?php

namespace App\Policies;

use App\Models\SchemeApplication;
use App\Models\User;
use App\Services\GeographicScopeService;

class SchemeApplicationPolicy
{
    public function view(User $user, SchemeApplication $application): bool
    {
        if ($user->hasRole('citizen')) {
            if ($user->citizen_id === null) return false;
            if ($application->citizen_id === $user->citizen_id) return true;
            $familyId = \App\Models\Citizen::whereKey($user->citizen_id)->value('family_id');
            return $familyId !== null
                && \App\Models\Family::whereKey($familyId)->value('head_citizen_id') === $user->citizen_id
                && $application->family_id === $familyId;
        }

        return $user->hasPermission('schemes.view')
            && app(GeographicScopeService::class)->allows($user, $application);
    }

    public function review(User $user, SchemeApplication $application): bool
    {
        return $user->hasPermission('schemes.manage')
            && app(GeographicScopeService::class)->allows($user, $application);
    }

    public function withdraw(User $user, SchemeApplication $application): bool
    {
        return $user->hasRole('citizen')
            && $user->citizen_id !== null
            && $application->citizen_id === $user->citizen_id;
    }
}
