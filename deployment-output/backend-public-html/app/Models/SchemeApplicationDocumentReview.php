<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SchemeApplicationDocumentReview extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'application_id', 'requirement_id', 'document_id', 'status',
        'reviewed_by', 'reviewed_at', 'rejection_reason', 'created_by', 'updated_by',
    ];

    protected $casts = ['reviewed_at' => 'datetime'];

    public function application() { return $this->belongsTo(SchemeApplication::class, 'application_id'); }
    public function requirement() { return $this->belongsTo(SchemeRequiredDocument::class, 'requirement_id'); }
    public function document() { return $this->belongsTo(Document::class); }
    public function reviewedBy() { return $this->belongsTo(User::class, 'reviewed_by'); }
}
