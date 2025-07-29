<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProdutoController;
use App\Http\Controllers\FavoritosController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\ProdutoUsuarioController;
use App\Http\Controllers\LookController;
use App\Http\Controllers\MontadorController;
use App\Http\Controllers\StorageController;
use App\Http\Controllers\Admin\FilterController;

Route::get('/', function () {
    return response()->json(['message' => 'API Brecho LoopLook is working!', 'version' => '1.0']);
});

Route::get('/storage/{path}', [StorageController::class, 'serve'])->where('path', '.*');

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/login/google', [AuthController::class, 'loginWithGoogle']);

// Rotas públicas de produtos
Route::get('/produtos', [ProdutoController::class, 'index']);
Route::get('/produtos/search', [ProdutoController::class, 'search']);
Route::get('/produtos/filtros', [ProdutoController::class, 'getFiltros']);
Route::get('/produtos/{id}', [ProdutoController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/looks/{id}', [LookController::class, 'show']);
    Route::post('/looks', [LookController::class, 'store']);
    Route::get('/looks', [LookController::class, 'index']);
    Route::put('/looks/{id}', [LookController::class, 'update']);
    Route::delete('/looks/{id}', [LookController::class, 'destroy']);

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/usuario/profile', [UsuarioController::class, 'updateProfile']);
    Route::post('/usuario/foto', [UsuarioController::class, 'uploadFoto'])->name('usuario.uploadFoto');

    Route::post('/produtos', [ProdutoController::class, 'store']);
    Route::post('/produtos/{produtoId}/imagens', [ProdutoController::class, 'uploadImagem']);

    Route::post('/favoritos/toggle', [FavoritosController::class, 'toggle']);
    Route::get('/favoritos', [FavoritosController::class, 'index']);
    Route::get('/favoritos/ids', [FavoritosController::class, 'getFavoritosIds']);

    Route::get('/produto-usuario', [ProdutoUsuarioController::class, 'index']);
    Route::get('/produto-usuario/{produtoUsuario}', [ProdutoUsuarioController::class, 'show']);
    Route::post('/produto-usuario', [ProdutoUsuarioController::class, 'store']);
    Route::delete('/produto-usuario/{produtoUsuario}', [ProdutoUsuarioController::class, 'destroy']);

    Route::get('/montador/roupas', [MontadorController::class, 'getItensDisponiveis']);

    // Rotas do Admin - Filtros
    Route::prefix('admin')->group(function () {
        Route::get('/filtros/tipos', [FilterController::class, 'types']);
        Route::get('/filtros/{type}', [FilterController::class, 'index']);
        Route::post('/filtros/{type}', [FilterController::class, 'store']);
        Route::put('/filtros/{type}/{id}', [FilterController::class, 'update']);
        Route::delete('/filtros/{type}/{id}', [FilterController::class, 'destroy']);
    });
});

// Rota para servir imagens com CORS
Route::get('/images/{path}', [App\Http\Controllers\ImageController::class, 'show'])->where('path', '.*')->name('image.show');