<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProjectBudget extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'project_id',
        'budget_head',
        'description',
        'allocated_amount',
        'revised_amount',
        'utilized_amount',
        'balance_amount',
        'status',
        'allocation_date',
        'remarks',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'allocated_amount' => 'decimal:2',
        'revised_amount' => 'decimal:2',
        'utilized_amount' => 'decimal:2',
        'balance_amount' => 'decimal:2',
        'allocation_date' => 'date',
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
