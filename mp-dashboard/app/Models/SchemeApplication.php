<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Crypt;

class SchemeApplication extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'application_number',
        'scheme_id',
        'citizen_id',
        'family_id',
        'applicant_name',
        'applicant_mobile',
        'applicant_email',
        'village_id',
        'ward_id',
        'status',
        'application_date',
        'processed_by',
        'processed_date',
        'rejection_reason',
        'remarks',
        'sanctioned_amount',
        'sanction_date',
        'sanction_order_number',
        'payment_status',
        'payment_date',
        'transaction_id',
        'bank_account_number',
        'bank_ifsc',
        'bank_name',
        'bank_account_ciphertext',
        'bank_account_hash',
        'bank_ifsc_ciphertext',
        'created_by',
        'updated_by',
        'submitted_by',
        'application_source',
        'pending_reason',
    ];

    protected $casts = [
        'application_date' => 'date',
        'processed_date' => 'date',
        'sanctioned_amount' => 'decimal:2',
        'sanction_date' => 'date',
        'payment_date' => 'date',
    ];

    protected $hidden = ['bank_account_number', 'bank_ifsc', 'bank_account_ciphertext', 'bank_account_hash', 'bank_ifsc_ciphertext'];
    protected $appends = ['bank_account_masked', 'bank_ifsc_masked', 'submitted_by_user'];

    public function getSubmittedByUserAttribute(): ?array
    {
        $user = $this->relationLoaded('submittedBy') ? $this->getRelation('submittedBy') : null;
        return $user ? ['id' => $user->id, 'name' => $user->name] : null;
    }

    public function setBankAccountNumberAttribute(?string $value): void
    {
        $digits = preg_replace('/\D/', '', (string) $value);
        $this->attributes['bank_account_number'] = null;
        $this->attributes['bank_account_ciphertext'] = $digits !== '' ? Crypt::encryptString($digits) : null;
        $this->attributes['bank_account_hash'] = $digits !== '' ? hash_hmac('sha256', $digits, config('app.key')) : null;
    }

    public function setBankIfscAttribute(?string $value): void
    {
        $normalized = strtoupper(trim((string) $value));
        $this->attributes['bank_ifsc'] = null;
        $this->attributes['bank_ifsc_ciphertext'] = $normalized !== '' ? Crypt::encryptString($normalized) : null;
    }

    public function getBankAccountMaskedAttribute(): ?string
    {
        $ciphertext = $this->attributes['bank_account_ciphertext'] ?? null;
        $account = $ciphertext ? Crypt::decryptString($ciphertext) : null;
        return $account ? str_repeat('X', max(strlen($account) - 4, 0)).substr($account, -4) : null;
    }

    public function getBankIfscMaskedAttribute(): ?string
    {
        $ciphertext = $this->attributes['bank_ifsc_ciphertext'] ?? null;
        $ifsc = $ciphertext ? Crypt::decryptString($ciphertext) : null;
        return $ifsc ? substr($ifsc, 0, 4).'0******' : null;
    }

    public function scheme()
    {
        return $this->belongsTo(Scheme::class);
    }

    public function citizen()
    {
        return $this->belongsTo(Citizen::class);
    }

    public function family()
    {
        return $this->belongsTo(Family::class);
    }

    public function village()
    {
        return $this->belongsTo(Village::class);
    }

    public function ward()
    {
        return $this->belongsTo(Ward::class);
    }

    public function processedBy()
    {
        return $this->belongsTo(User::class, 'processed_by');
    }

    public function beneficiaries()
    {
        return $this->hasMany(SchemeBeneficiary::class, 'application_id');
    }

    public function benefitDisbursements()
    {
        return $this->hasMany(BenefitDisbursement::class, 'application_id');
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function submittedBy()
    {
        return $this->belongsTo(User::class, 'submitted_by');
    }

    public function documents()
    {
        return $this->morphMany(Document::class, 'documentable');
    }

    public function activityLogs()
    {
        return $this->morphMany(ActivityLog::class, 'loggable');
    }

    public function documentReviews()
    {
        return $this->hasMany(SchemeApplicationDocumentReview::class, 'application_id');
    }
}
