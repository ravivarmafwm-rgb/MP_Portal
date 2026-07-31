<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AuthUserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $parts = preg_split('/\s+/', trim($this->name));
        $initials = collect($parts)->filter()->take(2)->map(fn ($part) => mb_strtoupper(mb_substr($part, 0, 1)))->implode('');

        return ['id' => $this->id, 'name' => $this->name, 'email' => $this->email, 'role' => $this->role?->name, 'role_slug' => $this->role?->slug, 'citizen_id' => $this->citizen_id, 'initials' => $initials, 'mfa_enabled' => (bool) $this->mfa_enabled, 'mfa_required' => $this->hasRole(['super-admin', 'mp', 'mla', 'constituency-coordinator', 'mp-staff', 'officer'])];
    }
}
