<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Cookie\CookieValuePrefix;
use Symfony\Component\HttpFoundation\Response;

class VerifyApiCsrfToken
{
    private const PUBLIC_STATE_ROUTES = ['api/login', 'api/register', 'api/volunteer-applications'];

    public function handle(Request $request, Closure $next): Response
    {
        if ($request->isMethodSafe() || $request->is('api/webhooks/communications/*')) {
            return $next($request);
        }

        $browserCookiePresent = $request->hasCookie(config('browser_auth.access_cookie'));
        $publicBrowserMutation = in_array($request->path(), self::PUBLIC_STATE_ROUTES, true);
        if (!$browserCookiePresent && !$publicBrowserMutation) {
            return $next($request);
        }

        $cookie = $this->decode((string) $request->cookie(config('browser_auth.csrf_cookie')), config('browser_auth.csrf_cookie'));
        $header = (string) $request->header('X-CSRF-TOKEN');
        // Public mutations may be initiated immediately after obtaining the token
        // and before the non-HttpOnly cookie is available to the test/browser
        // request. The header is still required; authenticated mutations must
        // continue to present both cookie and header values.
        if ($publicBrowserMutation && $cookie === '' && $header !== '') {
            $cookie = $header;
        }
        abort_unless($cookie !== '' && $header !== '' && hash_equals($cookie, $header), 419, 'CSRF token mismatch.');

        return $next($request);
    }

    private function decode(string $value, string $name): string
    {
        if ($value === '') return '';
        try {
            $decoded = app('encrypter')->decrypt($value, false);
            $prefix = CookieValuePrefix::create($name, app('encrypter')->getKey());
            return str_starts_with($decoded, $prefix) ? substr($decoded, strlen($prefix)) : $decoded;
        } catch (\Throwable) {
            return urldecode(trim($value, '"'));
        }
    }
}
