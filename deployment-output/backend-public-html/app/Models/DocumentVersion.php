<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class DocumentVersion extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'document_id',
        'version_number',
        'file_name',
        'file_path',
        'file_size',
        'file_type',
        'mime_type',
        'storage_disk',
        'checksum_sha256',
        'change_notes',
        'uploaded_by',
        'is_current',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'version_number' => 'integer',
        'is_current' => 'boolean',
    ];

    protected $hidden = ['file_path', 'storage_disk', 'checksum_sha256'];

    public function document()
    {
        return $this->belongsTo(Document::class);
    }

    public function uploadedBy()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
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
