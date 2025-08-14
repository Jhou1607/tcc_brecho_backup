<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Usuario; // Importe o Model Usuario
use App\Models\Produto; // Importe o Model Produto
use App\Models\ProdutoUsuario; // Importe o Model ProdutoUsuario
use App\Models\Armario; // Importe o Model Armario

class ArmarioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Armario::query()->delete();

        $usuario = \App\Models\Usuario::where('email', 'jc.chiavelli@unesp.br')->first();
        if (!$usuario) {
            echo "Usuário jc.chiavelli@unesp.br não encontrado!\n";
            return;
        }

        // Pega todos os produtos próprios do usuário
        $produtosProprios = \App\Models\ProdutoUsuario::where('usuario_id', $usuario->id)->get();

        if ($produtosProprios->isEmpty()) {
            echo "Nenhum produto próprio encontrado para o usuário {$usuario->nome_usuario}!\n";
            return;
        }

        $count = 0;
        foreach ($produtosProprios as $produto) {
            try {
                \App\Models\Armario::create([
                    'usuario_id' => $usuario->id,
                    'item_id' => $produto->id,
                    'item_type' => \App\Models\ProdutoUsuario::class,
                ]);
                $count++;
            } catch (\Exception $e) {
                echo "Erro ao adicionar produto {$produto->id} ao armário: " . $e->getMessage() . "\n";
            }
        }
        
        echo "{$count} produtos próprios adicionados ao armário do usuário {$usuario->nome_usuario}!\n";
    }
}
