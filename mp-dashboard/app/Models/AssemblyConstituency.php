<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AssemblyConstituency extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'code',
        'constituency_id',
        'mla_name',
        'mla_party',
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
        'total_voters' => 'integer',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
    ];

    public function constituency()
    {
        return $this->belongsTo(Constituency::class);
    }

    public function mandals()
    {
        return $this->hasMany(Mandal::class);
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
