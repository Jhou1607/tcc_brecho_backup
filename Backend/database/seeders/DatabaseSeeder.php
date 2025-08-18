<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Database\Seeders\UsuarioSeeder;
use Database\Seeders\FilterOptionsSeeder;
use Database\Seeders\RealProdutoSeeder;
use App\Models\Usuario;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Criar usuários padrão
        $this->createDefaultUsers();
        
        $this->call([
            UsuarioSeeder::class,
            FilterOptionsSeeder::class,
            RealProdutoSeeder::class,
        ]);
    }

    private function createDefaultUsers(): void
{
    Usuario::updateOrCreate(
        ['email' => 'admin@brecho.com'],
        [
            'nome_usuario' => 'Administrador', 
            'email' => 'admin@brecho.com',
            'password' => bcrypt('admin123'),
            'role' => 'admin',
            'created_at' => now(),
            'updated_at' => now(),
        ]
    );

    // Usuário Comum
    Usuario::updateOrCreate(
        ['email' => 'user@brecho.com'],
            [
            'nome_usuario' => 'Usuário Teste', 
            'email' => 'user@brecho.com',
            'password' => bcrypt('user123'),
            'role' => 'user',
            'created_at' => now(),
            'updated_at' => now(),
            ]
        );
    }
}
