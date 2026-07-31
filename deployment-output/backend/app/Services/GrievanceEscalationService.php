<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\Grievance;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class GrievanceEscalationService
{
    public function escalate(Grievance $grievance, User $actor, string $reason, string $description, ?User $target = null, ?string $ip = null, ?string $userAgent = null): Grievance
    {
        return DB::transaction(function () use ($grievance, $actor, $reason, $description, $target, $ip, $userAgent) {
            $locked = Grievance::query()->lockForUpdate()->findOrFail($grievance->id);
            if ($locked->status === 'escalated' && $locked->escalations()->where('status', 'pending')->exists()) {
                return $locked->fresh(['escalations.escalatedTo']);
            }
            $fromStatus = $locked->status;
            $fromLevel = (int) $locked->escalation_level;
            $toLevel = min(5, $fromLevel + 1);
            $locked->escalations()->create([
                'from_level' => $fromLevel, 'to_level' => $toLevel,
                'escalated_by' => $actor->id, 'escalated_to' => $target?->id,
                'reason' => $reason, 'description' => $description,
                'escalation_date' => now()->toDateString(), 'status' => 'pending',
                'created_by' => $actor->id,
            ]);
            $locked->update(['status' => 'escalated', 'escalation_level' => $toLevel, 'updated_by' => $actor->id]);
            $locked->updates()->create([
                'updated_by' => $actor->id, 'update_type' => 'escalation',
                'from_status' => $fromStatus, 'to_status' => 'escalated',
                'remarks' => $description, 'is_internal' => false, 'is_public' => true,
                'created_by' => $actor->id,
            ]);
            ActivityLog::create([
                'user_id' => $actor->id, 'loggable_type' => Grievance::class, 'loggable_id' => $locked->id,
                'action' => 'escalated', 'module' => 'grievances',
                'description' => "Grievance escalated to level {$toLevel}: {$reason}",
                'old_values' => ['status' => $fromStatus, 'escalation_level' => $fromLevel],
                'new_values' => ['status' => 'escalated', 'escalation_level' => $toLevel, 'reason' => $reason],
                'ip_address' => $ip, 'user_agent' => $userAgent,
            ]);
            if ($target) {
                NotificationService::notifyUser($target, 'Grievance Escalated', "{$locked->grievance_number}: {$locked->subject}", 'grievance', "/grievances/detail?id={$locked->id}", $locked, 'high');
            } else {
                NotificationService::notifyRoles(['mp', 'mp-staff', 'constituency-coordinator'], 'Grievance Escalated', "{$locked->grievance_number}: {$locked->subject}", 'grievance', "/grievances/detail?id={$locked->id}", $locked, 'high');
            }
            return $locked->fresh(['escalations.escalatedTo', 'updates.updatedBy']);
        });
    }

    public function processOverdue(int $limit = 100): int
    {
        $processed = 0;
        Grievance::query()
            ->whereNotIn('status', ['resolved', 'closed', 'escalated'])
            ->whereNotNull('due_date')->whereDate('due_date', '<', today())
            ->whereDoesntHave('escalations', fn ($query) => $query->where('reason', 'sla_breach')->where('status', 'pending'))
            ->orderBy('due_date')->limit($limit)->get()
            ->each(function (Grievance $grievance) use (&$processed) {
                $actor = User::find($grievance->assigned_to ?: $grievance->updated_by ?: $grievance->created_by);
                if (!$actor) return;
                $this->escalate($grievance, $actor, 'sla_breach', "Automatically escalated after the SLA due date {$grievance->due_date->toDateString()} passed.");
                $processed++;
            });
        return $processed;
    }
}
