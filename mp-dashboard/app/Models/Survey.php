<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Survey extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'survey_code',
        'title',
        'description',
        'category',
        'constituency_id',
        'assembly_constituency_id',
        'mandal_id',
        'village_id',
        'start_date',
        'end_date',
        'status',
        'created_by',
        'supervised_by',
        'target_responses',
        'total_responses',
        'is_active',
        'require_authentication',
        'instructions',
        'language',
        'updated_by',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'target_responses' => 'integer',
        'total_responses' => 'integer',
        'is_active' => 'boolean',
        'require_authentication' => 'boolean',
    ];

    public function constituency()
    {
        return $this->belongsTo(Constituency::class);
    }

    public function assemblyConstituency()
    {
        return $this->belongsTo(AssemblyConstituency::class);
    }

    public function mandal()
    {
        return $this->belongsTo(Mandal::class);
    }

    public function village()
    {
        return $this->belongsTo(Village::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function supervisedBy()
    {
        return $this->belongsTo(User::class, 'supervised_by');
    }

    public function questions()
    {
        return $this->hasMany(SurveyQuestion::class);
    }

    public function responses()
    {
        return $this->hasMany(SurveyResponse::class);
    }
    public function assignments(){return $this->hasMany(SurveyAssignment::class);}

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
