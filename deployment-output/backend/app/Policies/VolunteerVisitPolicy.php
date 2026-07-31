<?php
namespace App\Policies;
use App\Models\User; use App\Models\VolunteerVisit; use App\Services\GeographicScopeService;
class VolunteerVisitPolicy {
 public function before(User $user): ?bool { return $user->hasRole('super-admin') ? true : null; }
 public function viewAny(User $user): bool { return $user->hasPermission('volunteer_visits.view'); }
 public function view(User $user, VolunteerVisit $visit): bool { return $this->viewAny($user) && ($user->hasRole('volunteer') ? $visit->volunteer?->user_id === $user->id : app(GeographicScopeService::class)->allows($user, $visit->volunteer)); }
 public function create(User $user): bool { return $user->hasPermission('volunteer_visits.manage'); }
 public function update(User $user, VolunteerVisit $visit): bool { return $user->hasPermission('volunteer_visits.update') && ($user->hasRole('volunteer') ? $visit->volunteer?->user_id === $user->id : app(GeographicScopeService::class)->allows($user, $visit->volunteer)); }
}
