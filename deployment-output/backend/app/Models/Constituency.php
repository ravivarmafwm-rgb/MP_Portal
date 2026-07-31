<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Constituency extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'code',
        'state',
        'district',
        'total_voters',
        'mp_name',
        'mp_party',
        'boundary',
        'latitude',
        'longitude',
        'is_active',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'total_voters' => 'integer',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
    ];

    public function assemblyConstituencies()
    {
        return $this->hasMany(AssemblyConstituency::class);
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
