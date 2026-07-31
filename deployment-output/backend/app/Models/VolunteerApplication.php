<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class VolunteerApplication extends Model
{
    use HasUuids;

    protected $fillable = ['first_name', 'last_name', 'email', 'mobile_number', 'date_of_birth', 'gender', 'village_id', 'ward_id', 'address', 'motivation', 'status', 'review_notes', 'reviewed_by', 'reviewed_at'];
    protected $casts = ['date_of_birth' => 'date', 'reviewed_at' => 'datetime'];

    public function village() { return $this->belongsTo(Village::class); }
    public function ward() { return $this->belongsTo(Ward::class); }
    public function reviewer() { return $this->belongsTo(User::class, 'reviewed_by'); }
}
