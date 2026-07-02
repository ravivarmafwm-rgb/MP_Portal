<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VolunteerPerformance extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'volunteer_id',
        'evaluation_period',
        'start_date',
        'end_date',
        'total_activities',
        'total_hours',
        'beneficiaries_served',
        'attendance_rate',
        'task_completion_rate',
        'quality_score',
        'leadership_score',
        'teamwork_score',
        'overall_score',
        'rating',
        'strengths',
        'areas_for_improvement',
        'feedback',
        'evaluated_by',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'total_activities' => 'integer',
        'total_hours' => 'decimal:2',
        'beneficiaries_served' => 'integer',
        'attendance_rate' => 'decimal:2',
        'task_completion_rate' => 'decimal:2',
        'quality_score' => 'decimal:2',
        'leadership_score' => 'decimal:2',
        'teamwork_score' => 'decimal:2',
        'overall_score' => 'decimal:2',
    ];

    public function volunteer()
    {
        return $this->belongsTo(Volunteer::class);
    }

    public function evaluatedBy()
    {
        return $this->belongsTo(User::class, 'evaluated_by');
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
