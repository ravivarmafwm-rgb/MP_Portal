<?php

namespace App\Policies;

use App\Models\Citizen;
use App\Models\User;
use App\Services\GeographicScopeService;

class CitizenPolicy
{
    public function before(User $user): ?bool { return $user->hasRole('super-admin') ? true : null; }
    public function viewAny(User $user): bool { return $user->hasPermission('citizens.view'); }
    public function view(User $user, Citizen $citizen): bool
    {
        if ($user->hasRole('citizen') && $user->citizen_id === $citizen->id) return true;
        if (!$user->hasPermission('citizens.view')) return false;
        return app(GeographicScopeService::class)->allows($user, $citizen);
    }
    public function create(User $user): bool { return $user->hasPermission('citizens.create'); }
    public function update(User $user, Citizen $citizen): bool { return $user->hasPermission('citizens.update') && $this->view($user, $citizen); }
    public function delete(User $user, Citizen $citizen): bool { return $user->hasPermission('citizens.delete') && $this->view($user, $citizen); }
}
