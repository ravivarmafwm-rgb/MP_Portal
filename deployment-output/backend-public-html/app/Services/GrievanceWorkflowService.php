<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\Grievance;
use App\Models\GrievanceAssignment;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class GrievanceWorkflowService
{
    public function respondToAssignment(Grievance $grievance, GrievanceAssignment $assignment, User $actor, array $data, ?string $ip, ?string $userAgent): Grievance
    {
        if ($assignment->grievance_id !== $grievance->id) abort(404);
        if ($assignment->assigned_to !== $actor->id) abort(403, 'Only the assigned officer may respond to this assignment.');

        return DB::transaction(function () use ($grievance, $assignment, $actor, $data, $ip, $userAgent) {
            $locked = GrievanceAssignment::query()->lockForUpdate()->findOrFail($assignment->id);
            if ($locked->status !== 'assigned') {
                throw ValidationException::withMessages(['action' => ['This assignment has already been actioned.']]);
            }
            $case = Grievance::query()->lockForUpdate()->findOrFail($grievance->id);
            $accepted = $data['action'] === 'accept';
            $locked->update($accepted ? [
                'status' => 'accepted', 'accepted_date' => now()->toDateString(), 'updated_by' => $actor->id,
            ] : [
                'status' => 'rejected', 'rejected_date' => now()->toDateString(),
                'rejection_reason' => $data['rejection_reason'], 'updated_by' => $actor->id,
            ]);
            $fromStatus = $case->status;
            $toStatus = $accepted ? 'in_progress' : 'pending';
            $case->update([
                'status' => $toStatus,
                'assigned_to' => $accepted ? $actor->id : null,
                'updated_by' => $actor->id,
            ]);
            $remarks = $accepted
                ? "Assignment accepted by {$actor->name}."
                : "Assignment rejected by {$actor->name}: {$data['rejection_reason']}";
            $this->record($case, $actor, $accepted ? 'assignment_accepted' : 'assignment_rejected', $fromStatus, $toStatus, $remarks, $ip, $userAgent);
            if ($assigner = User::find($locked->assigned_by)) {
                NotificationService::notifyUser($assigner, $accepted ? 'Grievance Assignment Accepted' : 'Grievance Assignment Rejected', "{$case->grievance_number}: {$remarks}", 'grievance', "/grievances/detail?id={$case->id}", $case, $accepted ? 'normal' : 'high');
            }
            return $this->fresh($case);
        });
    }

    public function resolve(Grievance $grievance, User $actor, array $data, ?string $ip, ?string $userAgent): Grievance
    {
        if (!in_array($grievance->status, ['in_progress', 'escalated'], true)) {
            throw ValidationException::withMessages(['status' => ['Only an in-progress or escalated grievance can be resolved.']]);
        }
        if ($grievance->assigned_to !== $actor->id && !$actor->hasRole(['super-admin', 'mp', 'mp-staff'])) {
            abort(403, 'Only the assigned officer or authorized leadership may resolve this grievance.');
        }

        return DB::transaction(function () use ($grievance, $actor, $data, $ip, $userAgent) {
            $case = Grievance::query()->lockForUpdate()->findOrFail($grievance->id);
            if (!in_array($case->status, ['in_progress', 'escalated'], true)) {
                throw ValidationException::withMessages(['status' => ['The grievance state changed and can no longer be resolved.']]);
            }
            $fromStatus = $case->status;
            $case->update([
                'status' => 'resolved', 'resolved_date' => now()->toDateString(),
                'resolution_summary' => $data['resolution_summary'], 'updated_by' => $actor->id,
            ]);
            $case->assignments()->whereIn('status', ['assigned', 'accepted'])->update(['status' => 'completed', 'updated_by' => $actor->id]);
            $case->escalations()->where('status', 'pending')->update(['status' => 'resolved', 'acknowledged_date' => now()->toDateString(), 'updated_by' => $actor->id]);
            $remarks = $data['public_remarks'] ?? $data['resolution_summary'];
            $this->record($case, $actor, 'resolved', $fromStatus, 'resolved', $remarks, $ip, $userAgent);
            $this->notifyCitizen($case, 'Grievance Resolved', "Your grievance {$case->grievance_number} was resolved. Please review the resolution.");
            return $this->fresh($case);
        });
    }

    public function close(Grievance $grievance, User $actor, array $data, ?string $ip, ?string $userAgent): Grievance
    {
        if ($grievance->status !== 'resolved') {
            throw ValidationException::withMessages(['status' => ['Only a resolved grievance can be closed.']]);
        }
        if (!$data['citizen_confirmed'] && !$actor->hasRole(['super-admin', 'mp', 'mp-staff'])) {
            abort(403, 'Only authorized leadership may close without citizen confirmation.');
        }

        return DB::transaction(function () use ($grievance, $actor, $data, $ip, $userAgent) {
            $case = Grievance::query()->lockForUpdate()->findOrFail($grievance->id);
            if ($case->status !== 'resolved') {
                throw ValidationException::withMessages(['status' => ['The grievance state changed and can no longer be closed.']]);
            }
            $case->update(['status' => 'closed', 'updated_by' => $actor->id]);
            $remarks = $data['citizen_confirmed']
                ? 'Closed after citizen confirmation.'
                : "Closed by authorized override: {$data['override_reason']}";
            $this->record($case, $actor, 'closed', 'resolved', 'closed', $remarks, $ip, $userAgent);
            $this->notifyCitizen($case, 'Grievance Closed', "Your grievance {$case->grievance_number} has been closed.");
            return $this->fresh($case);
        });
    }

    public function reopen(Grievance $grievance, User $actor, string $reason, ?string $ip, ?string $userAgent): Grievance
    {
        if (!in_array($grievance->status, ['resolved', 'closed'], true)) {
            throw ValidationException::withMessages(['status' => ['Only resolved or closed grievances can be reopened.']]);
        }
        if ($grievance->assigned_to !== $actor->id && !$actor->hasRole(['super-admin', 'mp', 'mp-staff'])) {
            abort(403, 'Only the assigned officer or authorized leadership may reopen this grievance.');
        }
        return DB::transaction(function () use ($grievance, $actor, $reason, $ip, $userAgent) {
            $case = Grievance::query()->lockForUpdate()->findOrFail($grievance->id);
            $from = $case->status;
            $case->update(['status' => 'in_progress', 'resolved_date' => null, 'updated_by' => $actor->id]);
            $this->record($case, $actor, 'reopened', $from, 'in_progress', $reason, $ip, $userAgent);
            $this->notifyCitizen($case, 'Grievance Reopened', "Your grievance {$case->grievance_number} has been reopened.");
            return $this->fresh($case);
        });
    }

    private function record(Grievance $grievance, User $actor, string $action, string $from, string $to, string $remarks, ?string $ip, ?string $userAgent): void
    {
        $grievance->updates()->create([
            'updated_by' => $actor->id, 'update_type' => $action, 'from_status' => $from,
            'to_status' => $to, 'remarks' => $remarks, 'is_internal' => false,
            'is_public' => true, 'created_by' => $actor->id,
        ]);
        ActivityLog::create([
            'user_id' => $actor->id, 'loggable_type' => Grievance::class, 'loggable_id' => $grievance->id,
            'action' => $action, 'module' => 'grievances', 'description' => $remarks,
            'old_values' => ['status' => $from], 'new_values' => ['status' => $to],
            'ip_address' => $ip, 'user_agent' => $userAgent,
        ]);
    }

    private function notifyCitizen(Grievance $grievance, string $title, string $message): void
    {
        $user = $grievance->citizen?->userAccount;
        if ($user) NotificationService::notifyUser($user, $title, $message, 'grievance', "/citizen", $grievance);
    }

    private function fresh(Grievance $grievance): Grievance
    {
        return $grievance->fresh([
            'category', 'citizen', 'village', 'assignedTo', 'assignedDepartment',
            'assignments.assignedTo', 'assignments.assignedBy', 'assignments.department',
            'escalations.escalatedTo', 'updates.updatedBy', 'feedback',
        ]);
    }
}
