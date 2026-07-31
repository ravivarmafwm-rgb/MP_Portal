<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VolunteerActivity extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'volunteer_id',
        'activity_type',
        'activity_category',
        'title',
        'description',
        'activity_date',
        'start_time',
        'end_time',
        'hours_spent',
        'location',
        'village_id',
        'ward_id',
        'beneficiaries_count',
        'status',
        'outcome',
        'challenges',
        'photo',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'activity_date' => 'date',
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'hours_spent' => 'decimal:2',
        'beneficiaries_count' => 'integer',
    ];

    public function volunteer()
    {
        return $this->belongsTo(Volunteer::class);
    }

    public function village()
    {
        return $this->belongsTo(Village::class);
    }

    public function ward()
    {
        return $this->belongsTo(Ward::class);
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
