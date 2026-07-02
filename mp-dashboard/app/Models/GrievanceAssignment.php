<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GrievanceAssignment extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'grievance_id',
        'assigned_to',
        'assigned_by',
        'department_id',
        'assignment_type',
        'instructions',
        'assigned_date',
        'due_date',
        'status',
        'accepted_date',
        'rejected_date',
        'rejection_reason',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'assigned_date' => 'date',
        'due_date' => 'date',
        'accepted_date' => 'date',
        'rejected_date' => 'date',
    ];

    public function grievance()
    {
        return $this->belongsTo(Grievance::class);
    }

    public function assignedTo()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function assignedBy()
    {
        return $this->belongsTo(User::class, 'assigned_by');
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
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
