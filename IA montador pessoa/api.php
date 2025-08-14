<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LookController;


Route::post('/look-ia', [LookController::class, 'gerarLook']);
Route::post('/look-comment', [LookController::class, 'geraComentario']);
