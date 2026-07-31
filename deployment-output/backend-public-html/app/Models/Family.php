<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Family extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'family_id',
        'village_id',
        'ward_id',
        'polling_booth_id',
        'head_of_family_name',
        'house_number',
        'street',
        'locality',
        'members_count',
        'voters_count',
        'ration_card_number',
        'ration_card_type',
        'annual_income',
        'economic_status',
        'caste',
        'religion',
        'is_bpl',
        'remarks',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'is_bpl' => 'boolean',
        'members_count' => 'integer',
        'voters_count' => 'integer',
    ];

    public function village()
    {
        return $this->belongsTo(Village::class);
    }

    public function ward()
    {
        return $this->belongsTo(Ward::class);
    }

    public function pollingBooth()
    {
        return $this->belongsTo(PollingBooth::class);
    }

    public function familyMembers()
    {
        return $this->hasMany(FamilyMember::class);
    }

    public function citizens()
    {
        return $this->hasManyThrough(Citizen::class, FamilyMember::class);
    }

    public function schemeApplications()
    {
        return $this->hasMany(SchemeApplication::class);
    }

    public function schemeBeneficiaries()
    {
        return $this->hasMany(SchemeBeneficiary::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function activityLogs()
    {
        return $this->morphMany(ActivityLog::class, 'loggable');
    }
}
