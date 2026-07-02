<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Mandal extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'code',
        'assembly_constituency_id',
        'total_villages',
        'total_voters',
        'boundary',
        'latitude',
        'longitude',
        'is_active',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'total_villages' => 'integer',
        'total_voters' => 'integer',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
    ];

    public function assemblyConstituency()
    {
        return $this->belongsTo(AssemblyConstituency::class);
    }

    public function villages()
    {
        return $this->hasMany(Village::class);
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
