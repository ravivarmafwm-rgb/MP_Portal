<?php
namespace App\Models;use Illuminate\Database\Eloquent\Concerns\HasUuids;use Illuminate\Database\Eloquent\Model;
class SurveyAssignment extends Model{use HasUuids;protected $guarded=[];protected $casts=['assigned_date'=>'date','due_date'=>'date'];public function survey(){return$this->belongsTo(Survey::class);}public function volunteer(){return$this->belongsTo(Volunteer::class);}public function assignedBy(){return$this->belongsTo(User::class,'assigned_by');}}
