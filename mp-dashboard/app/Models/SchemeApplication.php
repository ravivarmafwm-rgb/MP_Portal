<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'application_date' => 'date',
        'processed_date' => 'date',
        'sanctioned_amount' => 'decimal:2',
        'sanction_date' => 'date',
        'payment_date' => 'date',
    ];

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
        return $this->hasMany(SchemeBeneficiary::class);
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

    public function documents()
    {
        return $this->morphMany(Document::class, 'documentable');
    }

    public function activityLogs()
    {
        return $this->morphMany(ActivityLog::class, 'loggable');
    }
}
