<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VolunteerTraining extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'volunteer_id',
        'training_name',
        'training_type',
        'description',
        'start_date',
        'end_date',
        'venue',
        'trainer',
        'status',
        'certificate_number',
        'certificate_issue_date',
        'topics_covered',
        'feedback',
        'score',
        'grade',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'certificate_issue_date' => 'date',
        'score' => 'decimal:2',
    ];

    public function volunteer()
    {
        return $this->belongsTo(Volunteer::class);
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
