<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateUserInvitationRequest extends FormRequest
{
    public function authorize(): bool { return $this->user()?->hasRole('super-admin') === true; }

    public function rules(): array
    {
        $officialRoles = ['super-admin', 'mp', 'mla', 'mp-staff', 'constituency-coordinator', 'assembly-coordinator', 'mandal-coordinator', 'village-coordinator', 'government-officer'];
        return [
            'name' => ['required', 'string', 'min:2', 'max:255'],
            'email' => ['required', 'email:rfc,dns', 'max:255', 'unique:users,email', 'unique:user_invitations,email'],
            'role_slug' => ['required', Rule::in($officialRoles), Rule::exists('roles', 'slug')->where('is_active', true)],
            'constituency_id' => ['nullable', 'uuid', 'exists:constituencies,id'],
            'assembly_constituency_id' => ['nullable', 'uuid', 'exists:assembly_constituencies,id'],
            'mandal_id' => ['nullable', 'uuid', 'exists:mandals,id'],
            'village_id' => ['nullable', 'uuid', 'exists:villages,id'],
            'ward_id' => ['nullable', 'uuid', 'exists:wards,id'],
            'department_id' => ['nullable', 'uuid', 'exists:departments,id'],
        ];
    }
}
