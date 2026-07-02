<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Citizen extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'unique_id',
        'first_name',
        'middle_name',
        'last_name',
        'father_name',
        'mother_name',
        'spouse_name',
        'date_of_birth',
        'gender',
        'aadhaar_number',
        'voter_id',
        'mobile_number',
        'alternate_mobile',
        'email',
        'education',
        'occupation',
        'marital_status',
        'blood_group',
        'disability_status',
        'disability_details',
        'is_voter',
        'voter_status',
        'is_deceased',
        'date_of_death',
        'photo',
        'biometric_data',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'is_voter' => 'boolean',
        'is_deceased' => 'boolean',
        'date_of_birth' => 'date',
        'date_of_death' => 'date',
    ];

    public function familyMembers()
    {
        return $this->hasMany(FamilyMember::class);
    }

    public function families()
    {
        return $this->belongsToMany(Family::class, 'family_members');
    }

    public function addresses()
    {
        return $this->hasMany(CitizenAddress::class);
    }

    public function interactions()
    {
        return $this->hasMany(CitizenInteraction::class);
    }

    public function grievances()
    {
        return $this->hasMany(Grievance::class);
    }

    public function schemeApplications()
    {
        return $this->hasMany(SchemeApplication::class);
    }

    public function schemeBeneficiaries()
    {
        return $this->hasMany(SchemeBeneficiary::class);
    }

    public function surveyResponses()
    {
        return $this->hasMany(SurveyResponse::class);
    }

    public function documents()
    {
        return $this->morphMany(Document::class, 'documentable');
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
