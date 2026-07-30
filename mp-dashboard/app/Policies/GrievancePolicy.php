<?php
namespace App\Policies;
use App\Models\Grievance; use App\Models\User; use App\Services\GeographicScopeService;
class GrievancePolicy {
 public function before(User $user): ?bool { return $user->hasRole('super-admin') ? true : null; }
 public function viewAny(User $user): bool { return $user->hasPermission('grievances.view'); }
 public function view(User $user, Grievance $grievance): bool { return $user->hasPermission('grievances.view') && app(GeographicScopeService::class)->allows($user, $grievance); }
 public function create(User $user): bool { return $user->hasPermission('grievances.create'); }
 public function update(User $user, Grievance $grievance): bool { return $user->hasPermission('grievances.update') && app(GeographicScopeService::class)->allows($user, $grievance); }
}
