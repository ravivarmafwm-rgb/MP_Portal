<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Concerns\HasUuids; use Illuminate\Database\Eloquent\Model; use Illuminate\Database\Eloquent\SoftDeletes;
class CommunicationCampaign extends Model { use HasUuids,SoftDeletes; protected $guarded=[]; protected $casts=['audience_filters'=>'array','scheduled_at'=>'datetime','started_at'=>'datetime','completed_at'=>'datetime','approved_at'=>'datetime']; public function template(){return $this->belongsTo(CommunicationTemplate::class,'template_id');} public function recipients(){return $this->hasMany(CommunicationRecipient::class,'campaign_id');} }
