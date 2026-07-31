<?php

namespace App\Services;

use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Cookie;

class BrowserAuthCookieService
{
    public function attachAccessCookie(JsonResponse $response, string $plainTextToken): JsonResponse
    {
        return $response->withCookie($this->cookie(config('browser_auth.access_cookie'), $plainTextToken, true));
    }

    public function attachCsrfCookie(JsonResponse $response, string $token): JsonResponse
    {
        return $response->withCookie($this->cookie(config('browser_auth.csrf_cookie'), $token, false));
    }

    public function forgetAuthentication(JsonResponse $response): JsonResponse
    {
        return $response
            ->withCookie($this->expiredCookie(config('browser_auth.access_cookie'), true))
            ->withCookie($this->expiredCookie(config('browser_auth.csrf_cookie'), false));
    }

    private function cookie(string $name, string $value, bool $httpOnly): Cookie
    {
        return new Cookie($name, $value, now()->addMinutes(config('browser_auth.lifetime_minutes')), config('browser_auth.path'), config('browser_auth.domain'), (bool) config('browser_auth.secure'), $httpOnly, false, config('browser_auth.same_site'));
    }

    private function expiredCookie(string $name, bool $httpOnly): Cookie
    {
        return new Cookie($name, '', 1, config('browser_auth.path'), config('browser_auth.domain'), (bool) config('browser_auth.secure'), $httpOnly, false, config('browser_auth.same_site'));
    }
}
