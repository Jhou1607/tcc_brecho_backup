<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Database\Seeders\UsuarioSeeder;
use Database\Seeders\ProdutoSeeder;
use Database\Seeders\ImagemSeeder;


class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UsuarioSeeder::class,
            ProdutoSeeder::class,
            ImagemSeeder::class,
            ProdutoUsuarioSeeder::class,
            ArmarioSeeder::class,
        ]);
    }
}
