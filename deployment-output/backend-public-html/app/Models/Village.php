<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Village extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'code',
        'mandal_id',
        'households',
        'population',
        'total_voters',
        'sarpanch_name',
        'ward_count',
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
        'ward_count' => 'integer',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
    ];

    public function mandal()
    {
        return $this->belongsTo(Mandal::class);
    }

    public function wards()
    {
        return $this->hasMany(Ward::class);
    }

    public function families()
    {
        return $this->hasMany(Family::class);
    }

    public function citizens()
    {
        return $this->hasManyThrough(Citizen::class, Family::class);
    }

    public function projects()
    {
        return $this->hasMany(Project::class);
    }

    public function surveys()
    {
        return $this->hasMany(Survey::class);
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
