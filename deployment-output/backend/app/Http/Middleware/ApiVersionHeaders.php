<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class ApiVersionHeaders
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);
        $response->headers->set('X-API-Version', 'v1');
        $response->headers->set('Vary', trim($response->headers->get('Vary').' Accept-Version'));
        return $response;
    }
}
