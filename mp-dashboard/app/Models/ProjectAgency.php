<?php
namespace App\Models; use Illuminate\Database\Eloquent\Concerns\HasUuids; use Illuminate\Database\Eloquent\Factories\HasFactory; use Illuminate\Database\Eloquent\Model; use Illuminate\Database\Eloquent\SoftDeletes;
class ProjectAgency extends Model { use HasFactory,HasUuids,SoftDeletes; protected $fillable=['name','code','description','contact_person','contact_email','contact_phone','is_active','created_by','updated_by']; protected $casts=['is_active'=>'boolean']; public function projects(){return $this->hasMany(Project::class,'agency_id');} }
