<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class CitizenAddress extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'citizen_id',
        'address_type',
        'village_id',
        'ward_id',
        'polling_booth_id',
        'house_number',
        'street',
        'locality',
        'landmark',
        'post_office',
        'pincode',
        'district',
        'state',
        'country',
        'latitude',
        'longitude',
        'is_primary',
        'valid_from',
        'valid_to',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
        'valid_from' => 'date',
        'valid_to' => 'date',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
    ];

    public function citizen()
    {
        return $this->belongsTo(Citizen::class);
    }

    public function village()
    {
        return $this->belongsTo(Village::class);
    }

    public function ward()
    {
        return $this->belongsTo(Ward::class);
    }

    public function pollingBooth()
    {
        return $this->belongsTo(PollingBooth::class);
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
