<?php

namespace App\Policies\Concerns;

use App\Models\User;
use App\Services\GeographicScopeService;
use Illuminate\Database\Eloquent\Model;

trait AuthorizesMeetingRecords
{
    public function before(User $user): ?bool
    {
        return $user->hasRole('super-admin') ? true : null;
    }

    public function viewAny(User $user): bool
    {
        return $user->hasPermission('meetings.view');
    }

    public function view(User $user, Model $record): bool
    {
        return $user->hasPermission('meetings.view')
            && app(GeographicScopeService::class)->allowsHierarchicalResource($user, $record);
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('meetings.manage');
    }

    public function update(User $user, Model $record): bool
    {
        return $user->hasPermission('meetings.manage')
            && app(GeographicScopeService::class)->allowsHierarchicalResource($user, $record);
    }
}
