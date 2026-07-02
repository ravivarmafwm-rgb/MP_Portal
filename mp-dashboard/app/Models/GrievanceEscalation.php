<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GrievanceEscalation extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'grievance_id',
        'from_level',
        'to_level',
        'escalated_by',
        'escalated_to',
        'reason',
        'description',
        'escalation_date',
        'status',
        'acknowledged_date',
        'remarks',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'from_level' => 'integer',
        'to_level' => 'integer',
        'escalation_date' => 'date',
        'acknowledged_date' => 'date',
    ];

    public function grievance()
    {
        return $this->belongsTo(Grievance::class);
    }

    public function escalatedBy()
    {
        return $this->belongsTo(User::class, 'escalated_by');
    }

    public function escalatedTo()
    {
        return $this->belongsTo(User::class, 'escalated_to');
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
