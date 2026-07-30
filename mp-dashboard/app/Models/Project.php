<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'project_number',
        'name',
        'constituency_id',
        'assembly_constituency_id',
        'mandal_id',
        'village_id',
        'ward_id',
        'contractor_id',
        'project_type',
        'category',
        'description',
        'objectives',
        'estimated_cost',
        'sanctioned_amount',
        'sanction_date',
        'sanction_order_number',
        'start_date',
        'scheduled_completion_date',
        'actual_completion_date',
        'status',
        'progress_percentage',
        'expenditure',
        'location',
        'latitude',
        'longitude',
        'department',
        'supervised_by',
        'challenges',
        'remarks',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'estimated_cost' => 'decimal:2',
        'sanctioned_amount' => 'decimal:2',
        'sanction_date' => 'date',
        'start_date' => 'date',
        'scheduled_completion_date' => 'date',
        'actual_completion_date' => 'date',
        'progress_percentage' => 'decimal:2',
        'expenditure' => 'decimal:2',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
    ];

    public function constituency()
    {
        return $this->belongsTo(Constituency::class);
    }

    public function assemblyConstituency()
    {
        return $this->belongsTo(AssemblyConstituency::class);
    }

    public function mandal()
    {
        return $this->belongsTo(Mandal::class);
    }

    public function village()
    {
        return $this->belongsTo(Village::class);
    }

    public function ward()
    {
        return $this->belongsTo(Ward::class);
    }

    public function contractor()
    {
        return $this->belongsTo(Contractor::class);
    }

    public function supervisedBy()
    {
        return $this->belongsTo(User::class, 'supervised_by');
    }

    public function milestones()
    {
        return $this->hasMany(ProjectMilestone::class);
    }

    public function updates()
    {
        return $this->hasMany(ProjectUpdate::class);
    }

    public function budgets()
    {
        return $this->hasMany(ProjectBudget::class);
    }

    public function documents()
    {
        return $this->hasMany(ProjectDocument::class);
    }

    public function photos()
    {
        return $this->hasMany(ProjectPhoto::class);
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
