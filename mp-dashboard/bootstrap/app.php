<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withCommands([__DIR__.'/../app/Console/Commands'])
    ->withMiddleware(function (Middleware $middleware): void {
        // Allow all CORS preflight requests before anything else
        $middleware->prepend(\Illuminate\Http\Middleware\HandleCors::class);
        $middleware->api(prepend: [
            \App\Http\Middleware\UseHttpOnlyAccessToken::class,
            \App\Http\Middleware\VerifyApiCsrfToken::class,
        ]);
        $middleware->api(append: [\App\Http\Middleware\ApiVersionHeaders::class]);

        $middleware->alias([
            'role' => \App\Http\Middleware\EnsureRole::class,
            'permission' => \App\Http\Middleware\EnsurePermission::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*'),
        );
        $exceptions->render(function (\Throwable $e, Request $request) {
            if (!$request->is('api/*')) return null;
            $status = $e instanceof ValidationException ? 422 : ($e instanceof AuthorizationException ? 403 : ($e instanceof ModelNotFoundException ? 404 : ($e instanceof HttpExceptionInterface ? $e->getStatusCode() : 500)));
            $payload = ['message' => $status === 500 ? 'An unexpected server error occurred.' : ($e->getMessage() ?: 'The request could not be completed.'), 'code' => strtolower(class_basename($e)), 'request_id' => (string) \Illuminate\Support\Str::uuid()];
            if ($e instanceof ValidationException) $payload['errors'] = $e->errors();
            return response()->json($payload, $status);
        });
    })->create();
