<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PollingBooth extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'code',
        'ward_id',
        'booth_number',
        'building_name',
        'address',
        'total_voters',
        'male_voters',
        'female_voters',
        'presiding_officer',
        'contact_number',
        'latitude',
        'longitude',
        'is_active',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'total_voters' => 'integer',
        'male_voters' => 'integer',
        'female_voters' => 'integer',
        'booth_number' => 'integer',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
    ];

    public function ward()
    {
        return $this->belongsTo(Ward::class);
    }

    public function families()
    {
        return $this->hasMany(Family::class);
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
