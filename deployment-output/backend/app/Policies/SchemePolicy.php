<?php

namespace App\Policies;

use App\Models\Scheme;
use App\Models\User;

class SchemePolicy
{
    public function before(User $user): ?bool
    {
        return $user->hasRole('super-admin') ? true : null;
    }

    public function viewAny(User $user): bool
    {
        return $user->hasPermission('schemes.view');
    }

    public function view(User $user, Scheme $scheme): bool
    {
        return $user->hasPermission('schemes.view');
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('schemes.manage');
    }

    public function update(User $user, Scheme $scheme): bool
    {
        return $user->hasPermission('schemes.manage');
    }

    public function delete(User $user, Scheme $scheme): bool
    {
        return $user->hasPermission('schemes.manage');
    }
}
