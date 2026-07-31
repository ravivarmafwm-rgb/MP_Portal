<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProjectUpdate extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'project_id',
        'updated_by',
        'progress_percentage',
        'expenditure',
        'work_done',
        'challenges',
        'next_steps',
        'weather_condition',
        'labour_count',
        'machinery_count',
        'photo',
        'video',
        'latitude',
        'longitude',
        'update_date',
        'is_verified',
        'verified_by',
        'verified_date',
        'verification_notes',
        'created_by',
        'updated_by_user',
    ];

    protected $casts = [
        'progress_percentage' => 'decimal:2',
        'expenditure' => 'decimal:2',
        'labour_count' => 'integer',
        'machinery_count' => 'integer',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'update_date' => 'date',
        'is_verified' => 'boolean',
        'verified_date' => 'date',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function updatedByUser()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function verifiedBy()
    {
        return $this->belongsTo(User::class, 'verified_by');
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
        return $this->belongsTo(User::class, 'updated_by_user');
    }
}
