<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class VolunteerVisit extends \Illuminate\Database\Eloquent\Model
{
    use HasFactory, HasUuids, SoftDeletes;
    protected $fillable = ['volunteer_id','citizen_id','family_id','village_id','ward_id','visit_type','status','scheduled_at','checked_in_at','checked_out_at','check_in_latitude','check_in_longitude','check_out_latitude','check_out_longitude','notes','outcome','follow_up_required','follow_up_date','follow_up_notes','attachments','created_by','updated_by'];
    protected $casts = ['scheduled_at'=>'datetime','checked_in_at'=>'datetime','checked_out_at'=>'datetime','follow_up_date'=>'date','follow_up_required'=>'boolean','attachments'=>'array','check_in_latitude'=>'decimal:8','check_in_longitude'=>'decimal:8','check_out_latitude'=>'decimal:8','check_out_longitude'=>'decimal:8'];
    public function volunteer(){return $this->belongsTo(Volunteer::class);}
    public function citizen(){return $this->belongsTo(Citizen::class);}
    public function family(){return $this->belongsTo(Family::class);}
    public function village(){return $this->belongsTo(Village::class);}
    public function ward(){return $this->belongsTo(Ward::class);}
    public function activityLogs(){return $this->morphMany(ActivityLog::class,'loggable');}
}
