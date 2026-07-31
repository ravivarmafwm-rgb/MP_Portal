<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectDocument extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'project_id',
        'document_type',
        'title',
        'description',
        'file_name',
        'file_path',
        'file_size',
        'file_type',
        'document_date',
        'uploaded_by',
        'is_public',
        'status',
        'remarks',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'document_date' => 'date',
        'is_public' => 'boolean',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
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
