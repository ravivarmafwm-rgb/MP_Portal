<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MpTour extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'tour_number', 'title', 'objectives', 'tour_type', 'status',
        'start_date', 'end_date', 'departure_time', 'constituency_id',
        'assembly_constituencies_covered', 'mandals_covered', 'villages_covered',
        'villages_count', 'citizens_met', 'key_outcomes', 'issues_noted',
        'commitments_made', 'follow_up_actions', 'media_coverage',
        'led_by', 'team_members', 'created_by', 'updated_by',
    ];

    protected $casts = [
        'start_date'                       => 'date',
        'end_date'                         => 'date',
        'assembly_constituencies_covered'  => 'array',
        'mandals_covered'                  => 'array',
        'villages_covered'                 => 'array',
        'team_members'                     => 'array',
        'media_coverage'                   => 'array',
        'villages_count'                   => 'integer',
        'citizens_met'                     => 'integer',
    ];

    public function constituency(): BelongsTo
    {
        return $this->belongsTo(Constituency::class);
    }

    public function ledBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'led_by');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
