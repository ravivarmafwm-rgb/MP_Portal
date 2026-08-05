<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserInvitation extends Model
{
    use HasUuids;

    protected $fillable = ['name', 'email', 'role_id', 'invited_by', 'constituency_id', 'assembly_constituency_id', 'mandal_id', 'village_id', 'ward_id', 'department_id', 'token_hash', 'expires_at', 'accepted_at'];

    protected function casts(): array
    {
        return ['expires_at' => 'datetime', 'accepted_at' => 'datetime'];
    }

    public function role(): BelongsTo { return $this->belongsTo(Role::class); }
    public function inviter(): BelongsTo { return $this->belongsTo(User::class, 'invited_by'); }
}
