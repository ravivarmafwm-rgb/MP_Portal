<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class CacheGetResponse
{
    public function handle(Request $request, Closure $next, int $seconds = 60): Response
    {
        if (! $request->isMethod('GET') || ! $request->user()) return $next($request);
        $key = 'api-response:'.$request->user()->id.':'.sha1($request->fullUrl());
        $cached = Cache::get($key);
        if (is_array($cached)) return response()->json($cached['body'], $cached['status'], $cached['headers']);
        $response = $next($request);
        if ($response->isSuccessful() && str_contains((string) $response->headers->get('Content-Type'), 'application/json')) {
            Cache::put($key, ['body' => $response->getData(true), 'status' => $response->getStatusCode(), 'headers' => ['Content-Type' => 'application/json']], now()->addSeconds($seconds));
        }
        return $response;
    }
}
