<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProjectMilestone extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'project_id',
        'name',
        'description',
        'target_date',
        'actual_date',
        'target_percentage',
        'status',
        'budget',
        'actual_cost',
        'deliverables',
        'remarks',
        'sort_order',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'target_date' => 'date',
        'actual_date' => 'date',
        'target_percentage' => 'decimal:2',
        'budget' => 'decimal:2',
        'actual_cost' => 'decimal:2',
        'sort_order' => 'integer',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
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
