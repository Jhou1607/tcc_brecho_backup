<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Usuario;
use App\Models\ProdutoUsuario;

class ProdutoUsuarioSeeder extends Seeder
{
    public function run(): void
    {
        // Apaga todos os produtos próprios anteriores
        \App\Models\ProdutoUsuario::query()->delete();

        // Pega o usuário desejado para associar os produtos
        $usuario = \App\Models\Usuario::where('email', 'jc.chiavelli@unesp.br')->first();
        if (!$usuario) {
            echo "Usuário jc.chiavelli@unesp.br não encontrado!\n";
            return;
        }

        $produtosUsuario = [
            // Tops (20 produtos)
            ['nome_produto' => 'Camiseta Vintage Azul', 'categoria' => 'camiseta', 'marca' => 'Nike', 'cor' => 'azul', 'genero' => 'unissex'],
            ['nome_produto' => 'Blusa de Algodão Rosa', 'categoria' => 'blusa', 'marca' => 'Zara', 'cor' => 'rosa', 'genero' => 'feminino'],
            ['nome_produto' => 'Camisa de Flanela Vermelha', 'categoria' => 'camisa', 'marca' => 'Ralph Lauren', 'cor' => 'vermelho', 'genero' => 'masculino'],
            ['nome_produto' => 'Jaqueta Denim Clássica', 'categoria' => 'jaqueta', 'marca' => 'Levi\'s', 'cor' => 'azul', 'genero' => 'unissex'],
            ['nome_produto' => 'Suéter de Lã Cinza', 'categoria' => 'sueter', 'marca' => 'H&M', 'cor' => 'cinza', 'genero' => 'unissex'],
            ['nome_produto' => 'Regata de Academia', 'categoria' => 'regata', 'marca' => 'Adidas', 'cor' => 'preto', 'genero' => 'unissex'],
            ['nome_produto' => 'Colete Acolchoado Verde', 'categoria' => 'colete', 'marca' => 'The North Face', 'cor' => 'verde', 'genero' => 'unissex'],
            ['nome_produto' => 'Casaco de Inverno Marrom', 'categoria' => 'casaco', 'marca' => 'Columbia', 'cor' => 'marrom', 'genero' => 'unissex'],
            ['nome_produto' => 'Camiseta Estampada Branca', 'categoria' => 'camiseta', 'marca' => 'Vans', 'cor' => 'branco', 'genero' => 'unissex'],
            ['nome_produto' => 'Blusa de Seda Preta', 'categoria' => 'blusa', 'marca' => 'Forever 21', 'cor' => 'preto', 'genero' => 'feminino'],
            ['nome_produto' => 'Camisa Polo Azul', 'categoria' => 'camisa', 'marca' => 'Lacoste', 'cor' => 'azul', 'genero' => 'masculino'],
            ['nome_produto' => 'Jaqueta Bomber Preta', 'categoria' => 'jaqueta', 'marca' => 'Tommy Hilfiger', 'cor' => 'preto', 'genero' => 'unissex'],
            ['nome_produto' => 'Suéter de Cashmere Bege', 'categoria' => 'sueter', 'marca' => 'Banana Republic', 'cor' => 'bege', 'genero' => 'unissex'],
            ['nome_produto' => 'Regata Fitness Azul', 'categoria' => 'regata', 'marca' => 'Under Armour', 'cor' => 'azul', 'genero' => 'unissex'],
            ['nome_produto' => 'Colete Jeans Azul', 'categoria' => 'colete', 'marca' => 'Gap', 'cor' => 'azul', 'genero' => 'unissex'],
            ['nome_produto' => 'Casaco Parka Preto', 'categoria' => 'casaco', 'marca' => 'Canada Goose', 'cor' => 'preto', 'genero' => 'unissex'],
            ['nome_produto' => 'Camiseta Básica Preta', 'categoria' => 'camiseta', 'marca' => 'Uniqlo', 'cor' => 'preto', 'genero' => 'unissex'],
            ['nome_produto' => 'Blusa de Renda Branca', 'categoria' => 'blusa', 'marca' => 'Mango', 'cor' => 'branco', 'genero' => 'feminino'],
            ['nome_produto' => 'Camisa de Flanela Verde', 'categoria' => 'camisa', 'marca' => 'Hollister', 'cor' => 'verde', 'genero' => 'masculino'],
            ['nome_produto' => 'Jaqueta de Couro Preta', 'categoria' => 'jaqueta', 'marca' => 'AllSaints', 'cor' => 'preto', 'genero' => 'unissex'],

            // Bottoms (10 produtos)
            ['nome_produto' => 'Calça Jeans Skinny Azul', 'categoria' => 'calca', 'marca' => 'Levi\'s', 'cor' => 'azul', 'genero' => 'feminino'],
            ['nome_produto' => 'Saia Midi Plissada Preta', 'categoria' => 'saia', 'marca' => 'Zara', 'cor' => 'preto', 'genero' => 'feminino'],
            ['nome_produto' => 'Short Jeans Azul', 'categoria' => 'short', 'marca' => 'H&M', 'cor' => 'azul', 'genero' => 'unissex'],
            ['nome_produto' => 'Legging Fitness Preta', 'categoria' => 'legging', 'marca' => 'Lululemon', 'cor' => 'preto', 'genero' => 'feminino'],
            ['nome_produto' => 'Bermuda Cargo Verde', 'categoria' => 'bermuda', 'marca' => 'Nike', 'cor' => 'verde', 'genero' => 'masculino'],
            ['nome_produto' => 'Jardineira Denim Azul', 'categoria' => 'jardineira', 'marca' => 'Gap', 'cor' => 'azul', 'genero' => 'unissex'],
            ['nome_produto' => 'Calça Social Preta', 'categoria' => 'calca', 'marca' => 'Ralph Lauren', 'cor' => 'preto', 'genero' => 'masculino'],
            ['nome_produto' => 'Saia Longa Boho Bege', 'categoria' => 'saia', 'marca' => 'Free People', 'cor' => 'bege', 'genero' => 'feminino'],
            ['nome_produto' => 'Short Esportivo Cinza', 'categoria' => 'short', 'marca' => 'Adidas', 'cor' => 'cinza', 'genero' => 'unissex'],
            ['nome_produto' => 'Legging de Yoga Roxa', 'categoria' => 'legging', 'marca' => 'Athleta', 'cor' => 'roxo', 'genero' => 'feminino'],

            // Calçados (5 produtos)
            ['nome_produto' => 'Tênis Esportivo Branco', 'categoria' => 'tenis', 'marca' => 'Nike', 'cor' => 'branco', 'genero' => 'unissex'],
            ['nome_produto' => 'Sandália Gladiador Marrom', 'categoria' => 'sandalia', 'marca' => 'Steve Madden', 'cor' => 'marrom', 'genero' => 'feminino'],
            ['nome_produto' => 'Bota de Couro Preta', 'categoria' => 'bota', 'marca' => 'Dr. Martens', 'cor' => 'preto', 'genero' => 'unissex'],
            ['nome_produto' => 'Sapato Social Marrom', 'categoria' => 'sapato', 'marca' => 'Clarks', 'cor' => 'marrom', 'genero' => 'masculino'],
            ['nome_produto' => 'Chinelo Havaianas Azul', 'categoria' => 'chinelo', 'marca' => 'Havaianas', 'cor' => 'azul', 'genero' => 'unissex'],

            // Acessórios (5 produtos)
            ['nome_produto' => 'Cinto de Couro Marrom', 'categoria' => 'cinto', 'marca' => 'Fossil', 'cor' => 'marrom', 'genero' => 'unissex'],
            ['nome_produto' => 'Óculos de Sol Pretos', 'categoria' => 'oculos', 'marca' => 'Ray-Ban', 'cor' => 'preto', 'genero' => 'unissex'],
            ['nome_produto' => 'Bolsa Crossbody Preta', 'categoria' => 'bolsa', 'marca' => 'Michael Kors', 'cor' => 'preto', 'genero' => 'feminino'],
            ['nome_produto' => 'Relógio Analógico Prateado', 'categoria' => 'relogio', 'marca' => 'Fossil', 'cor' => 'prateado', 'genero' => 'unissex'],
            ['nome_produto' => 'Brinco de Prata', 'categoria' => 'brinco', 'marca' => 'Pandora', 'cor' => 'prateado', 'genero' => 'feminino'],
        ];

        foreach ($produtosUsuario as $produtoData) {
            ProdutoUsuario::create(array_merge($produtoData, [
                'usuario_id' => $usuario->id,
                'estacao' => \Faker\Factory::create()->randomElement(['verao', 'outono', 'inverno', 'primavera', 'todas']),
                'ocasioes' => \Faker\Factory::create()->randomElements(['trabalho', 'festa', 'casual', 'esporte', 'praia', 'balada', 'dia a dia'], \Faker\Factory::create()->numberBetween(1, 3)),
                'estilos' => \Faker\Factory::create()->randomElements(['classico', 'moderno', 'boho', 'minimalista', 'rocker', 'romantico', 'esportivo', 'urbano', 'vintage'], \Faker\Factory::create()->numberBetween(1, 3)),
                'material' => \Faker\Factory::create()->randomElement(['algodao', 'linho', 'la', 'seda', 'jeans', 'couro', 'moletom', 'viscose', 'poliester']),
            ]));
        }

        echo "40 produtos do usuário criados com sucesso!\n";
    }
}
