<?php

$isProduction = (string) env('APP_ENV', 'local') === 'production';
$configuredOrigins = array_values(array_filter(array_map('trim', explode(',', (string) env('CORS_ALLOWED_ORIGINS', '')))));

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => $isProduction
        ? ($configuredOrigins ?: array_values(array_filter([env('FRONTEND_URL')])))
        : array_values(array_filter([
            'http://localhost:3000', 'http://localhost:5173', 'http://localhost:8080', 'http://localhost:4173',
            'http://127.0.0.1:3000', 'http://127.0.0.1:5173', 'http://127.0.0.1:8080',
            'https://mpportal.focuswebmedia.in', 'https://mp-portal-focuswebmedia.vercel.app', env('FRONTEND_URL'),
        ])),
    'allowed_origins_patterns' => $isProduction ? [] : [
        '/^http:\/\/192\.168\.\d{1,3}\.\d{1,3}:\d{1,5}$/',
        '/^http:\/\/10\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d{1,5}$/',
    ],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 86400,
    'supports_credentials' => true,
];
