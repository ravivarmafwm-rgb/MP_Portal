<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\CompleteUserInvitationRequest;
use App\Http\Requests\Auth\CreateUserInvitationRequest;
use App\Http\Resources\AuthUserResource;
use App\Models\Role;
use App\Models\User;
use App\Models\UserInvitation;
use App\Services\BrowserAuthCookieService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserInvitationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        abort_unless($request->user()->hasRole('super-admin'), 403);
        $rows = UserInvitation::with('role:id,name,slug')->whereNull('accepted_at')->latest()->paginate(min(max($request->integer('per_page', 20), 1), 100));
        return response()->json(['data' => $rows->items(), 'meta' => ['total' => $rows->total(), 'current_page' => $rows->currentPage(), 'last_page' => $rows->lastPage(), 'per_page' => $rows->perPage()]]);
    }

    public function store(CreateUserInvitationRequest $request): JsonResponse
    {
        $data = $request->validated();
        $rawToken = Str::random(64);
        $role = Role::where('slug', $data['role_slug'])->where('is_active', true)->firstOrFail();
        unset($data['role_slug']);
        $invitation = DB::transaction(fn () => UserInvitation::create([...$data, 'role_id' => $role->id, 'invited_by' => $request->user()->id, 'token_hash' => hash('sha256', $rawToken), 'expires_at' => now()->addDays(3)]));
        return response()->json(['id' => $invitation->id, 'email' => $invitation->email, 'role' => $role->name, 'expires_at' => $invitation->expires_at, 'registration_url' => rtrim(config('app.frontend_url', env('FRONTEND_URL', '')), '/').'/official-register?token='.$rawToken], 201);
    }

    public function show(string $token): JsonResponse
    {
        $invitation = $this->validInvitation($token);
        return response()->json(['name' => $invitation->name, 'email' => $invitation->email, 'role' => $invitation->role->name, 'role_slug' => $invitation->role->slug, 'expires_at' => $invitation->expires_at]);
    }

    public function complete(CompleteUserInvitationRequest $request, BrowserAuthCookieService $cookies): JsonResponse
    {
        $invitation = $this->validInvitation($request->string('token')->toString());
        $user = DB::transaction(function () use ($invitation, $request) {
            $user = User::create(['name' => $invitation->name, 'email' => $invitation->email, 'password' => Hash::make($request->string('password')->toString()), 'role_id' => $invitation->role_id, 'constituency_id' => $invitation->constituency_id, 'assembly_constituency_id' => $invitation->assembly_constituency_id, 'mandal_id' => $invitation->mandal_id, 'village_id' => $invitation->village_id, 'ward_id' => $invitation->ward_id, 'department_id' => $invitation->department_id, 'is_active' => true, 'created_by' => $invitation->invited_by, 'password_changed_at' => now()]);
            $invitation->update(['accepted_at' => now()]);
            return $user->load('role');
        });
        $token = $user->createToken('Web session')->plainTextToken;
        return $cookies->attachAccessCookie(response()->json(['user' => AuthUserResource::make($user)->resolve($request)]), $token);
    }

    private function validInvitation(string $token): UserInvitation
    {
        $invitation = UserInvitation::with('role')->where('token_hash', hash('sha256', $token))->whereNull('accepted_at')->first();
        abort_unless($invitation && $invitation->expires_at->isFuture(), 404, 'This invitation is invalid or expired.');
        return $invitation;
    }
}
