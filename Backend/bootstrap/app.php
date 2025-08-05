<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
// Remova imports de Request e Throwable se não estavam no seu original

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Adiciona o middleware CORS global para todas as respostas, incluindo arquivos estáticos
        $middleware->append(\App\Http\Middleware\CorsAllMiddleware::class);

        // Registrar middleware de admin
        $middleware->alias([
            'admin' => \App\Http\Middleware\AdminMiddleware::class,
        ]);

        // Se você não tinha 'api' group aqui, remova. Se tinha, mantenha como estava.
        $middleware->group('api', [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
            \Illuminate\Routing\Middleware\ThrottleRequests::class . ':api',
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Remova qualquer bloco 'exceptions->render' que eu tenha te dado aqui,
        // ou deixe-o como estava no seu projeto ANTES das minhas alterações nesse arquivo.
    })->create();