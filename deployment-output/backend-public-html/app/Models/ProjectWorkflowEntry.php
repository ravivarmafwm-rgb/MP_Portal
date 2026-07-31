<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class ProjectWorkflowEntry extends Model { use HasFactory, HasUuids, SoftDeletes; protected $fillable=['project_id','entry_type','title','reference_number','status','department','agency','contractor','amount','entry_date','due_date','physical_progress','financial_progress','latitude','longitude','notes','details','created_by','updated_by']; protected $casts=['amount'=>'decimal:2','entry_date'=>'date','due_date'=>'date','physical_progress'=>'decimal:2','financial_progress'=>'decimal:2','latitude'=>'decimal:8','longitude'=>'decimal:8','details'=>'array']; public function project(){return $this->belongsTo(Project::class);} public function createdBy(){return $this->belongsTo(User::class,'created_by');} }
