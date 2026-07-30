<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class MeetingNote extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'notable_type', 'notable_id', 'title', 'content', 'note_type',
        'priority', 'is_private', 'is_completed', 'due_date',
        'completed_date', 'assigned_to_name', 'assigned_to', 'created_by',
    ];

    protected $casts = [
        'is_private'    => 'boolean',
        'is_completed'  => 'boolean',
        'due_date'      => 'date',
        'completed_date'=> 'date',
    ];

    public function notable(): MorphTo
    {
        return $this->morphTo();
    }

    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
