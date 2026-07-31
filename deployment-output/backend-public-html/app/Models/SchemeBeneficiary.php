<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Crypt;

class SchemeBeneficiary extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'scheme_id',
        'citizen_id',
        'family_id',
        'application_id',
        'beneficiary_name',
        'beneficiary_type',
        'enrollment_date',
        'status',
        'total_benefit_received',
        'benefit_count',
        'last_benefit_date',
        'account_number',
        'ifsc_code',
        'account_ciphertext',
        'account_hash',
        'ifsc_ciphertext',
        'remarks',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'enrollment_date' => 'date',
        'total_benefit_received' => 'decimal:2',
        'benefit_count' => 'integer',
        'last_benefit_date' => 'date',
    ];

    protected $hidden = ['account_number', 'ifsc_code', 'account_ciphertext', 'account_hash', 'ifsc_ciphertext'];
    protected $appends = ['account_number_masked', 'ifsc_masked'];

    public function setAccountNumberAttribute(?string $value): void
    {
        $digits = preg_replace('/\D/', '', (string) $value);
        $this->attributes['account_number'] = null;
        $this->attributes['account_ciphertext'] = $digits !== '' ? Crypt::encryptString($digits) : null;
        $this->attributes['account_hash'] = $digits !== '' ? hash_hmac('sha256', $digits, config('app.key')) : null;
    }

    public function setIfscCodeAttribute(?string $value): void
    {
        $normalized = strtoupper(trim((string) $value));
        $this->attributes['ifsc_code'] = null;
        $this->attributes['ifsc_ciphertext'] = $normalized !== '' ? Crypt::encryptString($normalized) : null;
    }

    public function getAccountNumberMaskedAttribute(): ?string
    {
        $ciphertext = $this->attributes['account_ciphertext'] ?? null;
        $account = $ciphertext ? Crypt::decryptString($ciphertext) : null;
        return $account ? str_repeat('X', max(strlen($account) - 4, 0)).substr($account, -4) : null;
    }

    public function getIfscMaskedAttribute(): ?string
    {
        $ciphertext = $this->attributes['ifsc_ciphertext'] ?? null;
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

    public function application()
    {
        return $this->belongsTo(SchemeApplication::class);
    }

    public function benefitDisbursements()
    {
        return $this->hasMany(BenefitDisbursement::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
