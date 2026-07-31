<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\BenefitDisbursement;
use App\Models\SchemeApplication;
use App\Models\SchemeBeneficiary;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class BenefitDisbursementService
{
    public function create(SchemeApplication $application, array $data, User $actor, ?string $ip, ?string $agent): BenefitDisbursement
    {
        return DB::transaction(function () use ($application, $data, $actor, $ip, $agent) {
            $locked = SchemeApplication::query()->with('beneficiaries')->lockForUpdate()->findOrFail($application->id);
            abort_unless($locked->status === 'approved', 422, 'Only approved applications can receive benefits.');
            $beneficiary = $locked->beneficiaries->first();
            abort_unless($beneficiary?->status === 'active', 422, 'An active beneficiary enrollment is required.');
            $committed = (float) BenefitDisbursement::where('application_id', $locked->id)
                ->whereIn('status', ['pending', 'completed'])
                ->sum('amount');
            abort_if($committed + (float) $data['amount'] > (float) $locked->sanctioned_amount, 422, 'Disbursement exceeds the remaining sanctioned amount.');

            $disbursement = BenefitDisbursement::create([
                'disbursement_number' => 'DIS'.now()->format('ymd').strtoupper(Str::random(6)),
                'scheme_id' => $locked->scheme_id, 'beneficiary_id' => $beneficiary->id,
                'application_id' => $locked->id, 'amount' => $data['amount'],
                'payment_mode' => $data['payment_mode'], 'reference_number' => $data['reference_number'] ?? null,
                'disbursement_date' => $data['disbursement_date'], 'status' => 'pending',
                'bank_name' => $data['bank_name'] ?? null, 'account_number' => $data['account_number'] ?? null,
                'ifsc_code' => $data['ifsc_code'] ?? null, 'remarks' => $data['remarks'] ?? null,
                'created_by' => $actor->id,
            ]);
            if ($data['payment_mode'] === 'bank_transfer') {
                $beneficiary->update([
                    'account_number' => $data['account_number'], 'ifsc_code' => $data['ifsc_code'],
                    'updated_by' => $actor->id,
                ]);
            }
            $locked->update(['payment_status' => 'processing', 'updated_by' => $actor->id]);
            $this->audit($actor, $locked, 'disbursement_created', [
                'disbursement_id' => $disbursement->id, 'amount' => $data['amount'],
                'payment_mode' => $data['payment_mode'], 'status' => 'pending',
            ], $ip, $agent);
            $this->notifyCitizen($locked, "Benefit {$disbursement->disbursement_number} is pending processing.");
            return $disbursement->fresh(['beneficiary', 'disbursedBy']);
        });
    }

    public function transition(BenefitDisbursement $disbursement, array $data, User $actor, ?string $ip, ?string $agent): BenefitDisbursement
    {
        return DB::transaction(function () use ($disbursement, $data, $actor, $ip, $agent) {
            $locked = BenefitDisbursement::query()->with(['application', 'beneficiary'])->lockForUpdate()->findOrFail($disbursement->id);
            $old = $locked->status;
            $target = match ($data['action']) {
                'complete' => 'completed', 'fail' => 'failed', 'retry' => 'pending',
            };
            abort_unless(
                (in_array($target, ['completed', 'failed'], true) && $old === 'pending')
                || ($target === 'pending' && $old === 'failed'),
                422,
                "Disbursement cannot transition from {$old} to {$target}."
            );
            if ($target === 'completed') {
                abort_if(BenefitDisbursement::where('transaction_id', $data['transaction_id'])->where('id', '!=', $locked->id)->exists(), 422, 'Transaction ID is already recorded.');
            }
            $locked->update([
                'status' => $target,
                'transaction_id' => $target === 'completed' ? $data['transaction_id'] : $locked->transaction_id,
                'failure_reason' => $target === 'failed' ? $data['failure_reason'] : null,
                'retry_date' => $target === 'pending' ? $data['retry_date'] : null,
                'retry_count' => $target === 'pending' ? $locked->retry_count + 1 : $locked->retry_count,
                'disbursed_by' => $target === 'completed' ? $actor->id : $locked->disbursed_by,
                'remarks' => $data['remarks'] ?? $locked->remarks,
                'updated_by' => $actor->id,
            ]);
            if ($target === 'completed') {
                $beneficiary = SchemeBeneficiary::query()->lockForUpdate()->findOrFail($locked->beneficiary_id);
                $beneficiary->update([
                    'total_benefit_received' => (float) $beneficiary->total_benefit_received + (float) $locked->amount,
                    'benefit_count' => $beneficiary->benefit_count + 1,
                    'last_benefit_date' => $locked->disbursement_date,
                    'updated_by' => $actor->id,
                ]);
            }
            $application = SchemeApplication::query()->lockForUpdate()->findOrFail($locked->application_id);
            $completedTotal = (float) BenefitDisbursement::where('application_id', $application->id)->where('status', 'completed')->sum('amount');
            $application->update([
                'payment_status' => $target === 'failed' ? 'failed'
                    : ($target === 'pending' ? 'processing'
                        : ($completedTotal >= (float) $application->sanctioned_amount ? 'paid' : 'partial')),
                'payment_date' => $target === 'completed' ? today() : $application->payment_date,
                'transaction_id' => $target === 'completed' ? $data['transaction_id'] : $application->transaction_id,
                'updated_by' => $actor->id,
            ]);
            $this->audit($actor, $application, "disbursement_{$target}", [
                'disbursement_id' => $locked->id, 'from_status' => $old, 'to_status' => $target,
                'amount' => $locked->amount,
            ], $ip, $agent);
            $this->notifyCitizen($application, "Benefit {$locked->disbursement_number} is now {$target}.");
            return $locked->fresh(['beneficiary', 'disbursedBy']);
        });
    }

    private function audit(User $actor, SchemeApplication $application, string $action, array $values, ?string $ip, ?string $agent): void
    {
        ActivityLog::create([
            'user_id' => $actor->id, 'loggable_type' => SchemeApplication::class,
            'loggable_id' => $application->id, 'action' => $action, 'module' => 'schemes',
            'description' => str_replace('_', ' ', ucfirst($action)).'.',
            'new_values' => $values, 'ip_address' => $ip, 'user_agent' => $agent,
        ]);
    }

    private function notifyCitizen(SchemeApplication $application, string $message): void
    {
        if ($user = User::where('citizen_id', $application->citizen_id)->first()) {
            NotificationService::notifyUser($user, 'Scheme Benefit Updated', $message, 'scheme', '/citizen', $application);
        }
    }
}
