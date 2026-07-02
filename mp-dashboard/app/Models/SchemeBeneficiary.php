<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
