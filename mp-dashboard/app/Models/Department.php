<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Department extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'code',
        'description',
        'contact_person',
        'contact_email',
        'contact_phone',
        'is_active',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function grievanceCategories()
    {
        return $this->hasMany(GrievanceCategory::class);
    }

    public function schemes()
    {
        return $this->hasMany(Scheme::class);
    }

    public function grievances()
    {
        return $this->hasMany(Grievance::class, 'assigned_department_id');
    }

    public function grievanceAssignments()
    {
        return $this->hasMany(GrievanceAssignment::class);
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
