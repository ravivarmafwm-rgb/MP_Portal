<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Appointment extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'appointment_number', 'citizen_name', 'citizen_mobile', 'citizen_email',
        'citizen_village', 'citizen_mandal', 'citizen_id', 'constituency_id',
        'assembly_constituency_id', 'mandal_id', 'village_id', 'purpose',
        'description', 'meeting_type', 'category', 'priority', 'status',
        'requested_date', 'requested_time', 'scheduled_date', 'scheduled_time',
        'duration_minutes', 'venue', 'token_number', 'queue_position',
        'grievance_id', 'scheme_application_id', 'assigned_officer_id',
        'assigned_officer_name', 'meeting_outcome', 'action_items',
        'follow_up_required', 'follow_up_date', 'follow_up_notes',
        'follow_up_completed', 'satisfaction_rating', 'citizen_feedback',
        'created_via', 'created_by', 'updated_by',
    ];

    protected $casts = [
        'requested_date'       => 'date',
        'scheduled_date'       => 'date',
        'follow_up_date'       => 'date',
        'follow_up_required'   => 'boolean',
        'follow_up_completed'  => 'boolean',
        'satisfaction_rating'  => 'integer',
        'queue_position'       => 'integer',
        'duration_minutes'     => 'integer',
    ];

    public function citizen(): BelongsTo
    {
        return $this->belongsTo(Citizen::class);
    }

    public function village(): BelongsTo
    {
        return $this->belongsTo(Village::class);
    }

    public function mandal(): BelongsTo
    {
        return $this->belongsTo(Mandal::class);
    }

    public function constituency(): BelongsTo
    {
        return $this->belongsTo(Constituency::class);
    }

    public function assemblyConstituency(): BelongsTo
    {
        return $this->belongsTo(AssemblyConstituency::class);
    }

    public function grievance(): BelongsTo
    {
        return $this->belongsTo(Grievance::class);
    }

    public function schemeApplication(): BelongsTo
    {
        return $this->belongsTo(SchemeApplication::class);
    }

    public function assignedOfficer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_officer_id');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function notes(): HasMany
    {
        return $this->hasMany(MeetingNote::class, 'notable_id')
            ->where('notable_type', self::class);
    }
}
