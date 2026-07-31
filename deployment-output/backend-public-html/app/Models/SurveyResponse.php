<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class SurveyResponse extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'survey_id',
        'client_submission_id',
        'citizen_id',
        'volunteer_id',
        'village_id',
        'ward_id',
        'respondent_name',
        'respondent_mobile',
        'response_date',
        'response_time',
        'collected_at',
        'submitted_offline',
        'latitude',
        'longitude',
        'status',
        'remarks',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'response_date' => 'date',
        'collected_at' => 'datetime',
        'submitted_offline' => 'boolean',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
    ];

    public function survey()
    {
        return $this->belongsTo(Survey::class);
    }

    public function citizen()
    {
        return $this->belongsTo(Citizen::class);
    }

    public function volunteer()
    {
        return $this->belongsTo(Volunteer::class);
    }

    public function village()
    {
        return $this->belongsTo(Village::class);
    }

    public function ward()
    {
        return $this->belongsTo(Ward::class);
    }

    public function responseDetails()
    {
        return $this->hasMany(SurveyResponseDetail::class);
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
