<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Support\Facades\Route;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        // Only the contact form uses the "web" group (session, cookies, CSRF).
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        // Content pages are stateless: no session and no cookies. They still need route model
        // binding, which is otherwise part of the "web" group.
        then: function () {
            Route::middleware(SubstituteBindings::class)->group(base_path('routes/pages.php'));
        },
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Behind the ingress, set TRUSTED_PROXIES so rate limits apply per visitor, not per proxy.
        if ($proxies = env('TRUSTED_PROXIES')) {
            $middleware->trustProxies(at: $proxies === '*' ? '*' : explode(',', $proxies));
        }
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
