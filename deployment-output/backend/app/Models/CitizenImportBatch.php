<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CitizenImportBatch extends \Illuminate\Database\Eloquent\Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'created_by', 'original_filename', 'storage_path', 'status', 'total_rows',
        'processed_rows', 'accepted_rows', 'rejected_rows', 'error_message',
        'started_at', 'completed_at',
    ];

    protected $casts = ['started_at' => 'datetime', 'completed_at' => 'datetime'];
    public function creator(): BelongsTo { return $this->belongsTo(User::class, 'created_by'); }
    public function rows(): HasMany { return $this->hasMany(CitizenImportRow::class, 'batch_id'); }
}
