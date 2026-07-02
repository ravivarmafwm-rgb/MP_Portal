<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JanataDarbarSession extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'session_number', 'title', 'description', 'status',
        'venue', 'constituency_id', 'assembly_constituency_id',
        'mandal_id', 'village_id', 'session_date', 'start_time', 'end_time',
        'max_registrations', 'registered_citizens', 'actual_attendance',
        'token_counter', 'issues_raised', 'issues_resolved',
        'issues_referred', 'issues_pending', 'main_topics',
        'key_outcomes', 'media_coverage', 'presided_by',
        'staff_assigned', 'created_by', 'updated_by',
    ];

    protected $casts = [
        'session_date'         => 'date',
        'main_topics'          => 'array',
        'staff_assigned'       => 'array',
        'max_registrations'    => 'integer',
        'registered_citizens'  => 'integer',
        'actual_attendance'    => 'integer',
        'token_counter'        => 'integer',
        'issues_raised'        => 'integer',
        'issues_resolved'      => 'integer',
        'issues_referred'      => 'integer',
        'issues_pending'       => 'integer',
    ];

    public function constituency(): BelongsTo
    {
        return $this->belongsTo(Constituency::class);
    }

    public function assemblyConstituency(): BelongsTo
    {
        return $this->belongsTo(AssemblyConstituency::class);
    }

    public function mandal(): BelongsTo
    {
        return $this->belongsTo(Mandal::class);
    }

    public function village(): BelongsTo
    {
        return $this->belongsTo(Village::class);
    }

    public function presidedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'presided_by');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function appointments()
    {
        // Appointments linked to this Janata Darbar session via scheduled_date
        return Appointment::whereDate('scheduled_date', $this->session_date);
    }
}
