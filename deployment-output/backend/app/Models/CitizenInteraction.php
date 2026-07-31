<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CitizenInteraction extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'citizen_id',
        'user_id',
        'interaction_type',
        'interaction_method',
        'subject',
        'notes',
        'outcome',
        'interaction_date',
        'interaction_time',
        'follow_up_required',
        'follow_up_date',
        'follow_up_notes',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'interaction_date' => 'date',
        'interaction_time' => 'datetime',
        'follow_up_date' => 'date',
    ];

    public function citizen()
    {
        return $this->belongsTo(Citizen::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
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
