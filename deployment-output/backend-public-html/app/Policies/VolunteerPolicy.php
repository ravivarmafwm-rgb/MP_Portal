<?php
namespace App\Policies;
use App\Models\Volunteer; use App\Models\User; use App\Services\GeographicScopeService;
class VolunteerPolicy {
 public function before(User $user): ?bool { return $user->hasRole('super-admin') ? true : null; }
 public function viewAny(User $user): bool { return $user->hasPermission('volunteers.view'); }
 public function view(User $user, Volunteer $volunteer): bool { return $user->hasPermission('volunteers.view') && app(GeographicScopeService::class)->allows($user, $volunteer); }
}
