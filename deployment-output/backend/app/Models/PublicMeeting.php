<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PublicMeeting extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'meeting_number', 'title', 'description', 'meeting_type', 'status',
        'venue', 'venue_address', 'constituency_id', 'assembly_constituency_id',
        'mandal_id', 'village_id', 'meeting_date', 'start_time', 'end_time',
        'expected_attendance', 'actual_attendance', 'agenda_items',
        'topics_discussed', 'key_outcomes', 'action_items', 'media_coverage',
        'organized_by', 'chief_guest', 'panelists', 'created_by', 'updated_by',
    ];

    protected $casts = [
        'meeting_date'        => 'date',
        'agenda_items'        => 'array',
        'topics_discussed'    => 'array',
        'panelists'           => 'array',
        'expected_attendance' => 'integer',
        'actual_attendance'   => 'integer',
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

    public function organizer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'organized_by');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function notes()
    {
        return $this->hasMany(MeetingNote::class, 'notable_id')
            ->where('notable_type', self::class);
    }
}
