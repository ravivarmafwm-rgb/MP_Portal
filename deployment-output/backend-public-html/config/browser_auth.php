<?php

return [
    'access_cookie' => env('AUTH_COOKIE_NAME', 'mp_access'),
    'csrf_cookie' => env('AUTH_CSRF_COOKIE_NAME', 'MP-XSRF-TOKEN'),
    'lifetime_minutes' => (int) env('AUTH_COOKIE_LIFETIME', 120),
    'path' => '/',
    'domain' => env('AUTH_COOKIE_DOMAIN'),
    'secure' => env('AUTH_COOKIE_SECURE', env('APP_ENV') === 'production'),
    'same_site' => env('AUTH_COOKIE_SAME_SITE', 'lax'),
];
