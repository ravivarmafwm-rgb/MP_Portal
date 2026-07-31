<?php
namespace App\Policies;
use App\Models\Survey; use App\Models\User; use App\Services\GeographicScopeService;
class SurveyPolicy {
 public function before(User $user): ?bool { return $user->hasRole('super-admin') ? true : null; }
 public function viewAny(User $user): bool { return $user->hasPermission('surveys.view'); }
 public function view(User $user, Survey $survey): bool { return $user->hasPermission('surveys.view') && app(GeographicScopeService::class)->allowsHierarchicalResource($user, $survey); }
 public function create(User $user): bool { return $user->hasPermission('surveys.manage'); }
 public function update(User $user, Survey $survey): bool { return $user->hasPermission('surveys.manage') && app(GeographicScopeService::class)->allowsHierarchicalResource($user, $survey); }
 public function delete(User $user, Survey $survey): bool { return $user->hasPermission('surveys.manage') && app(GeographicScopeService::class)->allowsHierarchicalResource($user, $survey); }
}
