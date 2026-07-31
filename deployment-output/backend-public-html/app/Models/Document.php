<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Document extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'document_number',
        'document_category_id',
        'documentable_type',
        'documentable_id',
        'title',
        'description',
        'file_name',
        'file_path',
        'storage_disk',
        'checksum_sha256',
        'file_size',
        'file_type',
        'mime_type',
        'document_date',
        'expiry_date',
        'status',
        'is_confidential',
        'is_verified',
        'verified_by',
        'verified_date',
        'remarks',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'document_date' => 'date',
        'expiry_date' => 'date',
        'is_confidential' => 'boolean',
        'is_verified' => 'boolean',
        'verified_date' => 'date',
    ];

    protected $hidden = ['file_path', 'storage_disk', 'checksum_sha256'];

    public function documentCategory()
    {
        return $this->belongsTo(DocumentCategory::class);
    }

    public function documentable()
    {
        return $this->morphTo();
    }

    public function verifiedBy()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function versions()
    {
        return $this->hasMany(DocumentVersion::class);
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
