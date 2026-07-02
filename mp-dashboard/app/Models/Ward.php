<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ward extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'code',
        'village_id',
        'ward_number',
        'households',
        'population',
        'total_voters',
        'councillor_name',
        'boundary',
        'latitude',
        'longitude',
        'is_active',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'households' => 'integer',
        'population' => 'integer',
        'total_voters' => 'integer',
        'ward_number' => 'integer',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
    ];

    public function village()
    {
        return $this->belongsTo(Village::class);
    }

    public function pollingBooths()
    {
        return $this->hasMany(PollingBooth::class);
    }

    public function families()
    {
        return $this->hasMany(Family::class);
    }

    public function projects()
    {
        return $this->hasMany(Project::class);
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
