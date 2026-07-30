<?php

namespace App\Policies;

use App\Models\Citizen;
use App\Models\User;

class CitizenPolicy
{
    public function before(User $user): ?bool { return $user->hasRole('super-admin') ? true : null; }
    public function viewAny(User $user): bool { return $user->hasPermission('citizens.view'); }
    public function view(User $user, Citizen $citizen): bool
    {
        if (!$user->hasPermission('citizens.view')) return false;
        if (!$user->village_id && !$user->ward_id) return true;
        return $citizen->addresses()->where(function ($query) use ($user) {
            if ($user->ward_id) $query->where('ward_id', $user->ward_id);
            elseif ($user->village_id) $query->where('village_id', $user->village_id);
        })->exists();
    }
    public function create(User $user): bool { return $user->hasPermission('citizens.create'); }
    public function update(User $user, Citizen $citizen): bool { return $user->hasPermission('citizens.update') && $this->view($user, $citizen); }
}
