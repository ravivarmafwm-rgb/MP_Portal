<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\SchemeApplication;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class SchemeApplicationService
{
    public function withdraw(SchemeApplication $application, string $reason, User $actor, ?string $ip, ?string $agent): SchemeApplication
    {
        return DB::transaction(function () use ($application, $reason, $actor, $ip, $agent) {
            $locked = SchemeApplication::query()->lockForUpdate()->findOrFail($application->id);
            abort_unless(in_array($locked->status, ['submitted', 'under_review'], true), 422, 'This application can no longer be withdrawn.');
            abort_if($locked->benefitDisbursements()->exists() || $locked->beneficiaries()->exists(), 422, 'Applications with approved benefits cannot be withdrawn.');
            $old = $locked->status;
            $locked->update([
                'status' => 'withdrawn',
                'remarks' => trim(($locked->remarks ? $locked->remarks."\n\n" : '')."Citizen withdrawal: {$reason}"),
                'updated_by' => $actor->id,
            ]);
            ActivityLog::create([
                'user_id' => $actor->id, 'loggable_type' => SchemeApplication::class,
                'loggable_id' => $locked->id, 'action' => 'application_withdrawn',
                'module' => 'schemes', 'description' => 'Citizen withdrew the scheme application.',
                'old_values' => ['status' => $old], 'new_values' => ['status' => 'withdrawn', 'reason' => $reason],
                'ip_address' => $ip, 'user_agent' => $agent,
            ]);
            $scope = app(GeographicScopeService::class);
            User::query()->where('is_active', true)
                ->whereHas('role.permissions', fn ($permissions) => $permissions->where('slug', 'schemes.manage'))
                ->get()->filter(fn (User $recipient) => $scope->allows($recipient, $locked))
                ->each(fn (User $recipient) => NotificationService::notifyUser(
                    $recipient, 'Scheme Application Withdrawn',
                    "{$locked->application_number} was withdrawn by the citizen.",
                    'scheme', "/schemes/application-detail?id={$locked->id}", $locked
                ));
            return $locked->fresh(['scheme.department', 'documentReviews.requirement']);
        });
    }

    public function review(SchemeApplication $application, array $data, User $actor, ?string $ip, ?string $agent): SchemeApplication
    {
        return DB::transaction(function () use ($application, $data, $actor, $ip, $agent) {
            $locked = SchemeApplication::query()->lockForUpdate()->findOrFail($application->id);
            $oldStatus = $locked->status;
            $target = match ($data['action']) {
                'start_review' => 'under_review',
                'approve' => 'approved',
                'reject' => 'rejected',
            };
            abort_unless(
                ($target === 'under_review' && in_array($oldStatus, ['pending', 'submitted'], true))
                || (in_array($target, ['approved', 'rejected'], true) && $oldStatus === 'under_review'),
                422,
                "Application cannot transition from {$oldStatus} to {$target}."
            );
            if ($target === 'approved' && $locked->scheme?->max_amount !== null) {
                abort_if((float) $data['sanctioned_amount'] > (float) $locked->scheme->max_amount, 422, 'Sanctioned amount exceeds the scheme maximum.');
            }
            if ($target === 'approved') {
                $requirements = $locked->scheme->requiredDocuments()
                    ->where('is_active', true)->where('is_mandatory', true)->get();
                $missing = $requirements->contains(function ($requirement) use ($locked) {
                    return !$locked->documentReviews()
                        ->where('requirement_id', $requirement->id)
                        ->where('status', 'verified')
                        ->whereHas('document', function ($documents) use ($requirement) {
                            $documents->where('status', 'active');
                            if ($requirement->max_age_days) {
                                $documents->whereDate('document_date', '>=', today()->subDays($requirement->max_age_days));
                            }
                        })->exists();
                });
                abort_if($missing, 422, 'All mandatory application documents must be verified and current before approval.');
            }
            $locked->update([
                'status' => $target,
                'processed_by' => $actor->id,
                'processed_date' => today(),
                'remarks' => $data['remarks'] ?? $locked->remarks,
                'rejection_reason' => $target === 'rejected' ? $data['rejection_reason'] : null,
                'sanctioned_amount' => $target === 'approved' ? $data['sanctioned_amount'] : null,
                'sanction_date' => $target === 'approved' ? today() : null,
                'sanction_order_number' => $target === 'approved' ? $data['sanction_order_number'] : null,
                'updated_by' => $actor->id,
            ]);
            if ($target === 'approved') {
                $locked->beneficiaries()->firstOrCreate(
                    ['citizen_id' => $locked->citizen_id],
                    [
                        'scheme_id' => $locked->scheme_id,
                        'family_id' => $locked->family_id,
                        'beneficiary_name' => $locked->applicant_name,
                        'beneficiary_type' => 'individual',
                        'enrollment_date' => today(),
                        'status' => 'active',
                        'created_by' => $actor->id,
                    ]
                );
            }
            ActivityLog::create([
                'user_id' => $actor->id, 'loggable_type' => SchemeApplication::class,
                'loggable_id' => $locked->id, 'action' => "application_{$target}",
                'module' => 'schemes', 'description' => "Scheme application moved from {$oldStatus} to {$target}.",
                'old_values' => ['status' => $oldStatus], 'new_values' => ['status' => $target],
                'ip_address' => $ip, 'user_agent' => $agent,
            ]);
            if ($citizenUser = User::where('citizen_id', $locked->citizen_id)->first()) {
                NotificationService::notifyUser(
                    $citizenUser, 'Scheme Application Updated',
                    "{$locked->application_number} is now ".str_replace('_', ' ', $target).'.',
                    'scheme', '/citizen', $locked
                );
            }
            return $locked->fresh(['scheme.department', 'citizen', 'village', 'processedBy', 'beneficiaries']);
        });
    }
}
