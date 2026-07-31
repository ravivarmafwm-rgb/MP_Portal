<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Facades\Crypt;

class Volunteer extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'citizen_id',
        'volunteer_id',
        'first_name',
        'middle_name',
        'last_name',
        'father_name',
        'date_of_birth',
        'gender',
        'mobile_number',
        'alternate_mobile',
        'email',
        'aadhaar_number',
        'aadhaar_ciphertext',
        'aadhaar_hash',
        'village_id',
        'ward_id',
        'polling_booth_id',
        'address',
        'education',
        'occupation',
        'volunteer_type',
        'joining_date',
        'status',
        'photo',
        'skills',
        'interests',
        'blood_group',
        'is_available',
        'total_activities',
        'total_hours',
        'performance_score',
        'remarks',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'joining_date' => 'date',
        'is_available' => 'boolean',
        'total_activities' => 'integer',
        'total_hours' => 'decimal:2',
        'performance_score' => 'decimal:2',
    ];

    protected $hidden = ['aadhaar_number', 'aadhaar_ciphertext', 'aadhaar_hash'];
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

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function citizen()
    {
        return $this->belongsTo(Citizen::class);
    }

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

    public function attendance()
    {
        return $this->hasMany(VolunteerAttendance::class);
    }

    public function activities()
    {
        return $this->hasMany(VolunteerActivity::class);
    }

    public function training()
    {
        return $this->hasMany(VolunteerTraining::class);
    }

    public function performance()
    {
        return $this->hasMany(VolunteerPerformance::class);
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
