<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
        return $this->belongsTo(SchemeApplication::class);
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
