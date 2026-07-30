<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Scheme extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'code',
        'category',
        'department_id',
        'description',
        'objectives',
        'eligibility',
        'benefits',
        'documents_required',
        'max_amount',
        'funding_source',
        'start_date',
        'end_date',
        'is_active',
        'application_mode',
        'approval_authority',
        'sla_days',
        'website_url',
        'helpline_number',
        'remarks',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'max_amount' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
        'is_active' => 'boolean',
        'sla_days' => 'integer',
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function eligibilityRules()
    {
        return $this->hasMany(SchemeEligibilityRule::class);
    }

    public function applications()
    {
        return $this->hasMany(SchemeApplication::class);
    }

    public function beneficiaries()
    {
        return $this->hasMany(SchemeBeneficiary::class);
    }

    public function benefitDisbursements()
    {
        return $this->hasManyThrough(BenefitDisbursement::class, SchemeBeneficiary::class);
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
