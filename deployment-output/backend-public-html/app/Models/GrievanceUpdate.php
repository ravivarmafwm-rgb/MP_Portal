<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GrievanceUpdate extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'grievance_id',
        'updated_by',
        'update_type',
        'from_status',
        'to_status',
        'remarks',
        'is_internal',
        'is_public',
        'attachment',
        'created_by',
    ];

    protected $casts = [
        'is_internal' => 'boolean',
        'is_public' => 'boolean',
    ];

    public function grievance()
    {
        return $this->belongsTo(Grievance::class);
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
