<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\Department;
use App\Models\Grievance;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class GrievanceAssignmentService
{
    public function assign(Grievance $grievance, array $data, User $actor, string $ip, ?string $userAgent): Grievance
    {
        $assignee = User::with('role')->findOrFail($data['assigned_to']);
        $department = Department::where('is_active', true)->findOrFail($data['department_id']);

        if (!$assignee->is_active || !$assignee->hasPermission('grievances.update')) {
            throw ValidationException::withMessages(['assigned_to' => ['The selected user cannot manage grievances.']]);
        }
        if ($assignee->department_id !== $department->id) {
            throw ValidationException::withMessages(['assigned_to' => ['The selected officer does not belong to the selected department.']]);
        }
        if (!app(GeographicScopeService::class)->allows($assignee, $grievance)) {
            throw ValidationException::withMessages(['assigned_to' => ['The selected officer is outside this grievance geography.']]);
        }

        return DB::transaction(function () use ($grievance, $data, $actor, $assignee, $department, $ip, $userAgent) {
            $locked = Grievance::query()->lockForUpdate()->findOrFail($grievance->id);
            $fromStatus = $locked->status;
            $dueDate = $data['due_date']
                ?? now()->addDays(max(1, (int) ($locked->category()->value('sla_days') ?? 7)))->toDateString();

            $locked->assignments()->whereIn('status', ['assigned', 'accepted'])->update([
                'status' => 'reassigned',
                'updated_by' => $actor->id,
            ]);
            $locked->assignments()->create([
                'assigned_to' => $assignee->id,
                'assigned_by' => $actor->id,
                'department_id' => $department->id,
                'assignment_type' => 'primary',
                'instructions' => $data['instructions'],
                'assigned_date' => now()->toDateString(),
                'due_date' => $dueDate,
                'status' => 'assigned',
                'created_by' => $actor->id,
            ]);
            $locked->update([
                'assigned_to' => $assignee->id,
                'assigned_department_id' => $department->id,
                'due_date' => $dueDate,
                'status' => 'assigned',
                'updated_by' => $actor->id,
            ]);
            $locked->updates()->create([
                'updated_by' => $actor->id,
                'update_type' => 'assignment',
                'from_status' => $fromStatus,
                'to_status' => 'assigned',
                'remarks' => "Assigned to {$assignee->name}, {$department->name}. {$data['instructions']}",
                'is_internal' => false,
                'is_public' => true,
                'created_by' => $actor->id,
            ]);
            ActivityLog::create([
                'user_id' => $actor->id,
                'loggable_type' => Grievance::class,
                'loggable_id' => $locked->id,
                'action' => 'assigned',
                'module' => 'grievances',
                'description' => "Grievance assigned to {$assignee->name}",
                'old_values' => ['status' => $fromStatus, 'assigned_to' => $grievance->assigned_to, 'department_id' => $grievance->assigned_department_id],
                'new_values' => ['status' => 'assigned', 'assigned_to' => $assignee->id, 'department_id' => $department->id, 'due_date' => $dueDate],
                'ip_address' => $ip,
                'user_agent' => $userAgent,
            ]);
            NotificationService::notifyUser(
                $assignee,
                'Grievance Assigned',
                "{$locked->grievance_number}: {$locked->subject}. Due {$dueDate}.",
                'grievance',
                "/grievances/detail?id={$locked->id}",
                $locked,
                $locked->priority === 'urgent' ? 'high' : 'normal',
            );

            return $locked->fresh([
                'category', 'citizen', 'village', 'assignedTo', 'assignedDepartment',
                'assignments.assignedTo', 'assignments.department', 'updates.updatedBy',
            ]);
        });
    }
}
