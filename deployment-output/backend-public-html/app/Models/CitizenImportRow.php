<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CitizenImportRow extends \Illuminate\Database\Eloquent\Model
{
    use HasFactory, HasUuids;

    protected $fillable = ['batch_id', 'row_number', 'payload', 'status', 'errors', 'citizen_id'];
    protected $casts = ['payload' => 'array', 'errors' => 'array'];
    public function batch(): BelongsTo { return $this->belongsTo(CitizenImportBatch::class, 'batch_id'); }
    public function citizen(): BelongsTo { return $this->belongsTo(Citizen::class); }
}
