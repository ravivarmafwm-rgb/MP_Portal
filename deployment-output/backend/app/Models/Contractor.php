<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Contractor extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'code',
        'contact_person',
        'mobile_number',
        'alternate_mobile',
        'email',
        'gst_number',
        'pan_number',
        'address',
        'city',
        'state',
        'pincode',
        'bank_name',
        'account_number',
        'ifsc_code',
        'license_number',
        'license_validity',
        'rating',
        'total_projects',
        'total_contract_value',
        'status',
        'remarks',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'license_validity' => 'date',
        'rating' => 'decimal:2',
        'total_projects' => 'integer',
        'total_contract_value' => 'decimal:2',
    ];

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
