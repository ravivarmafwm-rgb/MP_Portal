<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SchemeRequiredDocument extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'scheme_id', 'document_category_id', 'name', 'description', 'is_mandatory',
        'max_age_days', 'sort_order', 'is_active', 'created_by', 'updated_by',
    ];

    protected $casts = [
        'is_mandatory' => 'boolean', 'is_active' => 'boolean',
        'max_age_days' => 'integer', 'sort_order' => 'integer',
    ];

    public function scheme() { return $this->belongsTo(Scheme::class); }
    public function documentCategory() { return $this->belongsTo(DocumentCategory::class); }
    public function reviews() { return $this->hasMany(SchemeApplicationDocumentReview::class, 'requirement_id'); }
}
