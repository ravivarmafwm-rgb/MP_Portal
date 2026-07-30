<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterCitizenRequest;
use App\Http\Requests\Auth\UpdateProfileRequest;
use App\Http\Requests\Auth\ChangePasswordRequest;
use App\Http\Resources\AuthUserResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Login user and issue Sanctum token.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::with('role')->where('email', $request->email)->first();

        if (! $user || ! $user->is_active || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $expiredSessionIds = $user->tokens()->orderByDesc('last_used_at')->orderByDesc('created_at')->skip(4)->take(100)->pluck('id');
        if ($expiredSessionIds->isNotEmpty()) $user->tokens()->whereIn('id', $expiredSessionIds)->delete();
        $newToken = $user->createToken('Web session');
        $newToken->accessToken->forceFill(['ip_address' => $request->ip(), 'user_agent' => mb_substr((string) $request->userAgent(), 0, 1000)])->save();
        $token = $newToken->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'user' => AuthUserResource::make($user)->resolve(),
        ]);
    }

    /**
     * Register a new user.
     */
    public function register(RegisterCitizenRequest $request): JsonResponse
    {
        $role = Role::where('slug', 'citizen')->where('is_active', true)->firstOrFail();
        $user = DB::transaction(fn () => User::create([
            'name' => $request->validated('name'),
            'email' => $request->validated('email'),
            'password' => Hash::make($request->validated('password')),
            'role_id' => $role->id,
        ]));

        $user->load('role');
        $token = $user->createToken('mp-dashboard-token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'user' => AuthUserResource::make($user)->resolve(),
        ], 201);
    }

    /**
     * Logout and revoke current token.
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully.']);
    }

    /**
     * Return the authenticated user.
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->load('role');

        return response()->json(AuthUserResource::make($user)->resolve());
    }

    /**
     * Update profile.
     */
    public function updateProfile(UpdateProfileRequest $request): JsonResponse
    {
        $user = $request->user();
        $user->update($request->validated());
        return response()->json(AuthUserResource::make($user->load('role'))->resolve());
    }

    /**
     * Change password.
     */
    public function changePassword(ChangePasswordRequest $request): JsonResponse
    {
        $user = $request->user();
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Current password is incorrect.'], 422);
        }
        $user->update(['password' => Hash::make($request->password)]);
        $currentId = $request->user()->currentAccessToken()?->id;
        $user->tokens()->when($currentId, fn ($tokens) => $tokens->whereKeyNot($currentId))->delete();
        return response()->json(['message' => 'Password changed successfully.']);
    }

    public function sessions(Request $request): JsonResponse
    {
        $currentId = $request->user()->currentAccessToken()?->id;
        $sessions = $request->user()->tokens()->latest('last_used_at')->latest('created_at')->get()->map(fn ($token) => [
            'id' => (string) $token->id, 'name' => $token->name, 'ip_address' => $token->ip_address,
            'user_agent' => $token->user_agent, 'last_used_at' => $token->last_used_at?->toIso8601String(),
            'created_at' => $token->created_at?->toIso8601String(), 'is_current' => (string) $token->id === (string) $currentId,
        ]);
        return response()->json(['data' => $sessions]);
    }

    public function revokeSession(Request $request, string $token): JsonResponse
    {
        $session = $request->user()->tokens()->whereKey($token)->firstOrFail();
        abort_if((string) $session->id === (string) $request->user()->currentAccessToken()?->id, 422, 'Use logout to end the current session.');
        $session->delete();
        return response()->json(['message' => 'Session revoked.']);
    }

    public function revokeOtherSessions(Request $request): JsonResponse
    {
        $currentId = $request->user()->currentAccessToken()?->id;
        $request->user()->tokens()->when($currentId, fn ($tokens) => $tokens->whereKeyNot($currentId))->delete();
        return response()->json(['message' => 'Other sessions revoked.']);
    }

}
