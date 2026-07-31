<?php
namespace App\Policies;
use App\Models\Project; use App\Models\User; use App\Services\GeographicScopeService;
class ProjectPolicy {
 public function before(User $user): ?bool { return $user->hasRole('super-admin') ? true : null; }
 public function viewAny(User $user): bool { return $user->hasPermission('projects.view'); }
 public function view(User $user, Project $project): bool { return $user->hasPermission('projects.view') && app(GeographicScopeService::class)->allows($user, $project); }
 public function create(User $user): bool { return $user->hasPermission('projects.manage'); }
 public function update(User $user, Project $project): bool { return $user->hasPermission('projects.manage') && app(GeographicScopeService::class)->allows($user, $project); }
 public function delete(User $user, Project $project): bool { return $user->hasPermission('projects.manage') && app(GeographicScopeService::class)->allows($user, $project); }
}
