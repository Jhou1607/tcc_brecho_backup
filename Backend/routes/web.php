<?php

use Illuminate\Support\Facades\Route;

Route::get('/test-storage-url', function () {
    $testPath = 'fotos/perfil/teste.jpg'; // Um caminho de exemplo
    return response()->json([
        'APP_URL_from_env' => env('APP_URL'),
        'config_filesystems_public_url' => config('filesystems.disks.public.url'),
        'generated_storage_url' => Storage::disk('public')->url($testPath),
        'asset_helper_url' => asset('storage/' . $testPath)
    ]);
});
