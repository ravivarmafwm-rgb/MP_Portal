<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Grievance extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'grievance_number',
        'category_id',
        'citizen_id',
        'citizen_name',
        'citizen_mobile',
        'citizen_email',
        'village_id',
        'ward_id',
        'polling_booth_id',
        'subject',
        'description',
        'priority',
        'severity',
        'status',
        'source',
        'assigned_to',
        'assigned_department_id',
        'due_date',
        'resolved_date',
        'resolution_summary',
        'escalation_level',
        'satisfaction_rating',
        'citizen_feedback',
        'is_anonymous',
        'location',
        'latitude',
        'longitude',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'due_date' => 'date',
        'resolved_date' => 'date',
        'escalation_level' => 'integer',
        'is_anonymous' => 'boolean',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
    ];

    public function category()
    {
        return $this->belongsTo(GrievanceCategory::class);
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

    public function assignedTo()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function assignedDepartment()
    {
        return $this->belongsTo(Department::class, 'assigned_department_id');
    }

    public function assignments()
    {
        return $this->hasMany(GrievanceAssignment::class);
    }

    public function escalations()
    {
        return $this->hasMany(GrievanceEscalation::class);
    }

    public function updates()
    {
        return $this->hasMany(GrievanceUpdate::class);
    }

    public function feedback()
    {
        return $this->hasMany(GrievanceFeedback::class);
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
