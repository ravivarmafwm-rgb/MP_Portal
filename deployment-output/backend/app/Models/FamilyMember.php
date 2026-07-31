<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FamilyMember extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'family_id',
        'citizen_id',
        'relationship_with_head',
        'is_head',
        'date_of_joining_family',
        'remarks',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'is_head' => 'boolean',
        'date_of_joining_family' => 'date',
    ];

    public function family()
    {
        return $this->belongsTo(Family::class);
    }

    public function citizen()
    {
        return $this->belongsTo(Citizen::class);
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
