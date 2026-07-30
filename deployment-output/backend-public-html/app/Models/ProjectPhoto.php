<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectPhoto extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'project_id',
        'project_update_id',
        'title',
        'description',
        'file_name',
        'file_path',
        'thumbnail_path',
        'file_size',
        'latitude',
        'longitude',
        'photo_date',
        'captured_by',
        'is_before',
        'is_after',
        'is_verified',
        'status',
        'sort_order',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'photo_date' => 'date',
        'is_before' => 'boolean',
        'is_after' => 'boolean',
        'is_verified' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function projectUpdate()
    {
        return $this->belongsTo(ProjectUpdate::class);
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
