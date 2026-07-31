<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Concerns\HasUuids; use Illuminate\Database\Eloquent\Model;
class CommunicationConsent extends Model { use HasUuids; protected $guarded=[]; protected $casts=['is_granted'=>'boolean','granted_at'=>'datetime','revoked_at'=>'datetime']; }
