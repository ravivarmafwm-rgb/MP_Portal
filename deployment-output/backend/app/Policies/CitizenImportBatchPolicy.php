<?php

namespace App\Policies;

use App\Models\CitizenImportBatch;
use App\Models\User;

class CitizenImportBatchPolicy
{
    public function before(User $user): ?bool { return $user->hasRole('super-admin') ? true : null; }
    public function viewAny(User $user): bool { return $user->hasPermission('citizens.import'); }
    public function view(User $user, CitizenImportBatch $batch): bool
    {
        return $user->hasPermission('citizens.import') && $batch->created_by === $user->id;
    }
    public function create(User $user): bool { return $user->hasPermission('citizens.import'); }
}
