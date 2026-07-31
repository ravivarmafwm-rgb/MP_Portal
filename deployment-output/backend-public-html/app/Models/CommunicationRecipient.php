<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Concerns\HasUuids; use Illuminate\Database\Eloquent\Model;
class CommunicationRecipient extends Model { use HasUuids; protected $guarded=[]; protected $hidden=['destination']; protected $casts=['destination'=>'encrypted','variables'=>'array','provider_response'=>'array','queued_at'=>'datetime','sent_at'=>'datetime','delivered_at'=>'datetime','failed_at'=>'datetime']; public function campaign(){return $this->belongsTo(CommunicationCampaign::class,'campaign_id');} }
