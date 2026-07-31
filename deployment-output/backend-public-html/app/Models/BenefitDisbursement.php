<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Crypt;

class BenefitDisbursement extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'disbursement_number',
        'scheme_id',
        'beneficiary_id',
        'application_id',
        'amount',
        'payment_mode',
        'transaction_id',
        'reference_number',
        'disbursement_date',
        'disbursed_by',
        'status',
        'failure_reason',
        'retry_date',
        'retry_count',
        'bank_name',
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
        'amount' => 'decimal:2',
        'disbursement_date' => 'date',
        'retry_date' => 'date',
        'retry_count' => 'integer',
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

    public function beneficiary()
    {
        return $this->belongsTo(SchemeBeneficiary::class);
    }

    public function application()
    {
        return $this->belongsTo(SchemeApplication::class, 'application_id');
    }

    public function disbursedBy()
    {
        return $this->belongsTo(User::class, 'disbursed_by');
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
