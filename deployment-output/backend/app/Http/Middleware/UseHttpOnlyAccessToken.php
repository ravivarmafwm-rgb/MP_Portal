<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Cookie\CookieValuePrefix;
use Symfony\Component\HttpFoundation\Response;

class UseHttpOnlyAccessToken
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->bearerToken() && $token = $request->cookie(config('browser_auth.access_cookie'))) {
            $request->headers->set('Authorization', 'Bearer '.$this->decode($token, config('browser_auth.access_cookie')));
        }

        return $next($request);
    }

    private function decode(string $value, string $name): string
    {
        try {
            $decoded = app('encrypter')->decrypt($value, false);
            $prefix = CookieValuePrefix::create($name, app('encrypter')->getKey());
            return str_starts_with($decoded, $prefix) ? substr($decoded, strlen($prefix)) : $decoded;
        } catch (\Throwable) {
            return urldecode(trim($value, '"'));
        }
    }
}
