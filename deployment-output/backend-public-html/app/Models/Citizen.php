<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Database\Eloquent\SoftDeletes;

class Citizen extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

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
        'aadhaar_ciphertext',
        'aadhaar_hash',
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

    protected $hidden = ['aadhaar_number', 'aadhaar_ciphertext', 'aadhaar_hash', 'biometric_data'];
    protected $appends = ['aadhaar_masked'];

    public function setAadhaarNumberAttribute(?string $value): void
    {
        $digits = preg_replace('/\D/', '', (string) $value);
        $this->attributes['aadhaar_number'] = null;
        $this->attributes['aadhaar_ciphertext'] = $digits !== '' ? Crypt::encryptString($digits) : null;
        $this->attributes['aadhaar_hash'] = $digits !== '' ? hash_hmac('sha256', $digits, config('app.key')) : null;
    }

    public function getAadhaarNumberAttribute(): ?string
    {
        $ciphertext = $this->attributes['aadhaar_ciphertext'] ?? null;
        return $ciphertext ? Crypt::decryptString($ciphertext) : null;
    }

    public function getAadhaarMaskedAttribute(): ?string
    {
        $aadhaar = $this->aadhaar_number;
        return $aadhaar ? 'XXXX XXXX '.substr($aadhaar, -4) : null;
    }

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

    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }

    public function volunteerVisits()
    {
        return $this->hasMany(VolunteerVisit::class);
    }

    public function documents()
    {
        return $this->morphMany(Document::class, 'documentable');
    }

    public function activityLogs()
    {
        return $this->morphMany(ActivityLog::class, 'loggable');
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function userAccount()
    {
        return $this->hasOne(User::class);
    }
}
