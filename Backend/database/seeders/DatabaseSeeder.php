<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Database\Seeders\UsuarioSeeder;
use Database\Seeders\ProdutoSeeder;
use Database\Seeders\ImagemSeeder;
use Database\Seeders\FilterOptionsSeeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UsuarioSeeder::class,
            FilterOptionsSeeder::class, // Adicionar antes dos produtos
            ProdutoSeeder::class,
            ImagemSeeder::class,
            ProdutoUsuarioSeeder::class,
            ArmarioSeeder::class,
        ]);
    }
}
