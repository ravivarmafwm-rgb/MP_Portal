<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SchemeEligibilityRule extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'scheme_id',
        'rule_name',
        'rule_type',
        'condition',
        'field_name',
        'operator',
        'value',
        'is_mandatory',
        'sort_order',
        'error_message',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'is_mandatory' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function scheme()
    {
        return $this->belongsTo(Scheme::class);
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
