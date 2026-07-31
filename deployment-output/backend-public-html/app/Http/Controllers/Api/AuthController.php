<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use App\Models\Citizen;
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
use Illuminate\Support\Str;
use App\Services\BrowserAuthCookieService;
use App\Services\TotpService;

class AuthController extends Controller
{
    public function csrf(BrowserAuthCookieService $cookies): JsonResponse
    {
        $token = Str::random(64);

        return $cookies->attachCsrfCookie(response()->json(['csrf_token' => $token]), $token);
    }

    /**
     * Login user and issue Sanctum token.
     */
    public function login(LoginRequest $request, BrowserAuthCookieService $cookies, TotpService $totp): JsonResponse
    {
        $user = User::with('role')->where('email', $request->email)->first();

        if (! $user || ! $user->is_active || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $privileged = $user->hasRole(['super-admin', 'mp', 'mla', 'constituency-coordinator', 'mp-staff', 'officer']);
        if ($privileged && $user->mfa_enabled && !$totp->verify($user, (string) $request->input('mfa_code'))) {
            return response()->json(['message' => 'A valid authenticator code is required.', 'code' => 'mfa_required', 'mfa_required' => true], 428);
        }

        $expiredSessionIds = $user->tokens()->orderByDesc('last_used_at')->orderByDesc('created_at')->skip(4)->take(100)->pluck('id');
        if ($expiredSessionIds->isNotEmpty()) $user->tokens()->whereIn('id', $expiredSessionIds)->delete();
        $newToken = $user->createToken('Web session');
        $newToken->accessToken->forceFill(['ip_address' => $request->ip(), 'user_agent' => mb_substr((string) $request->userAgent(), 0, 1000)])->save();
        $token = $newToken->plainTextToken;

        return $cookies->attachAccessCookie(response()->json([
            'user' => AuthUserResource::make($user)->resolve(),
        ]), $token);
    }

    /**
     * Register a new user.
     */
    public function register(RegisterCitizenRequest $request, BrowserAuthCookieService $cookies): JsonResponse
    {
        $role = Role::where('slug', 'citizen')->where('is_active', true)->firstOrFail();
        $data = $request->validated();
        $user = DB::transaction(function () use ($data, $role) {
            $citizen = Citizen::create([
                'unique_id' => 'CIT'.Str::upper(Str::random(10)),
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'date_of_birth' => $data['date_of_birth'],
                'gender' => $data['gender'],
                'mobile_number' => $data['mobile_number'],
                'email' => $data['email'],
            ]);
            $user = User::create([
                'name' => trim($data['first_name'].' '.$data['last_name']),
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'role_id' => $role->id,
                'citizen_id' => $citizen->id,
            ]);
            $citizen->update(['created_by' => $user->id]);

            return $user;
        });

        $user->load('role');
        $newToken = $user->createToken('Web session');
        $newToken->accessToken->forceFill([
            'ip_address' => $request->ip(),
            'user_agent' => mb_substr((string) $request->userAgent(), 0, 1000),
        ])->save();
        $token = $newToken->plainTextToken;

        return $cookies->attachAccessCookie(response()->json([
            'user' => AuthUserResource::make($user)->resolve(),
        ], 201), $token);
    }

    /**
     * Logout and revoke current token.
     */
    public function logout(Request $request, BrowserAuthCookieService $cookies): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return $cookies->forgetAuthentication(response()->json(['message' => 'Logged out successfully.']));
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
        $user->update(['password' => Hash::make($request->password), 'password_changed_at' => now()]);
        $currentId = $request->user()->currentAccessToken()?->id;
        $user->tokens()->when($currentId, fn ($tokens) => $tokens->whereKeyNot($currentId))->delete();
        return response()->json(['message' => 'Password changed successfully.']);
    }

    public function mfaSetup(Request $request, TotpService $totp): JsonResponse
    {
        abort_unless($request->user()->hasRole(['super-admin', 'mp', 'mla', 'constituency-coordinator', 'mp-staff', 'officer']), 403);
        return response()->json($totp->provision($request->user()));
    }

    public function mfaConfirm(Request $request, TotpService $totp): JsonResponse
    {
        abort_unless($request->user()->hasRole(['super-admin', 'mp', 'mla', 'constituency-coordinator', 'mp-staff', 'officer']), 403);
        $request->validate(['code' => ['required', 'digits:6']]);
        abort_unless($totp->confirm($request->user(), $request->string('code')->toString()), 422, 'The authenticator code is invalid.');
        return response()->json(['message' => 'Multi-factor authentication enabled.', 'user' => AuthUserResource::make($request->user()->load('role'))->resolve()]);
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
