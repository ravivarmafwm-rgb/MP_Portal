<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GrievanceFeedback extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'grievance_id',
        'citizen_id',
        'feedback_type',
        'rating',
        'comments',
        'would_recommend',
        'feedback_date',
        'feedback_source',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'rating' => 'integer',
        'would_recommend' => 'boolean',
        'feedback_date' => 'date',
    ];

    public function grievance()
    {
        return $this->belongsTo(Grievance::class);
    }

    public function citizen()
    {
        return $this->belongsTo(Citizen::class);
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
