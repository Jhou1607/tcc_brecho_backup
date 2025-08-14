<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Produto;
use Illuminate\Support\Str;

class ProdutoSeeder extends Seeder
{
    public function run(): void
    {
        // Apaga todos os produtos anteriores
        \App\Models\Produto::query()->delete();

        $produtos = [
            // Tops (20 produtos)
            ['nome_produto' => 'Camiseta Básica Branca', 'categoria' => 'camiseta', 'preco' => 29.90, 'marca' => 'Nike', 'cor' => 'branco', 'genero' => 'unissex'],
            ['nome_produto' => 'Blusa de Seda Elegante', 'categoria' => 'blusa', 'preco' => 89.90, 'marca' => 'Zara', 'cor' => 'preto', 'genero' => 'feminino'],
            ['nome_produto' => 'Camisa Social Azul', 'categoria' => 'camisa', 'preco' => 129.90, 'marca' => 'Ralph Lauren', 'cor' => 'azul', 'genero' => 'masculino'],
            ['nome_produto' => 'Jaqueta Jeans Clássica', 'categoria' => 'jaqueta', 'preco' => 159.90, 'marca' => 'Levi\'s', 'cor' => 'azul', 'genero' => 'unissex'],
            ['nome_produto' => 'Suéter de Lã Quentinho', 'categoria' => 'sueter', 'preco' => 199.90, 'marca' => 'H&M', 'cor' => 'cinza', 'genero' => 'unissex'],
            ['nome_produto' => 'Regata Esportiva', 'categoria' => 'regata', 'preco' => 39.90, 'marca' => 'Adidas', 'cor' => 'preto', 'genero' => 'unissex'],
            ['nome_produto' => 'Colete Acolchoado', 'categoria' => 'colete', 'preco' => 149.90, 'marca' => 'The North Face', 'cor' => 'preto', 'genero' => 'unissex'],
            ['nome_produto' => 'Casaco de Inverno', 'categoria' => 'casaco', 'preco' => 299.90, 'marca' => 'Columbia', 'cor' => 'marrom', 'genero' => 'unissex'],
            ['nome_produto' => 'Camiseta Estampada', 'categoria' => 'camiseta', 'preco' => 49.90, 'marca' => 'Vans', 'cor' => 'vermelho', 'genero' => 'unissex'],
            ['nome_produto' => 'Blusa Transparente', 'categoria' => 'blusa', 'preco' => 69.90, 'marca' => 'Forever 21', 'cor' => 'rosa', 'genero' => 'feminino'],
            ['nome_produto' => 'Camisa Polo Verde', 'categoria' => 'camisa', 'preco' => 89.90, 'marca' => 'Lacoste', 'cor' => 'verde', 'genero' => 'masculino'],
            ['nome_produto' => 'Jaqueta Bomber', 'categoria' => 'jaqueta', 'preco' => 179.90, 'marca' => 'Tommy Hilfiger', 'cor' => 'preto', 'genero' => 'unissex'],
            ['nome_produto' => 'Suéter de Cashmere', 'categoria' => 'sueter', 'preco' => 399.90, 'marca' => 'Banana Republic', 'cor' => 'bege', 'genero' => 'unissex'],
            ['nome_produto' => 'Regata Fitness', 'categoria' => 'regata', 'preco' => 59.90, 'marca' => 'Under Armour', 'cor' => 'azul', 'genero' => 'unissex'],
            ['nome_produto' => 'Colete Jeans', 'categoria' => 'colete', 'preco' => 119.90, 'marca' => 'Gap', 'cor' => 'azul', 'genero' => 'unissex'],
            ['nome_produto' => 'Casaco Parka', 'categoria' => 'casaco', 'preco' => 399.90, 'marca' => 'Canada Goose', 'cor' => 'preto', 'genero' => 'unissex'],
            ['nome_produto' => 'Camiseta Básica Preta', 'categoria' => 'camiseta', 'preco' => 29.90, 'marca' => 'Uniqlo', 'cor' => 'preto', 'genero' => 'unissex'],
            ['nome_produto' => 'Blusa de Renda', 'categoria' => 'blusa', 'preco' => 79.90, 'marca' => 'Mango', 'cor' => 'branco', 'genero' => 'feminino'],
            ['nome_produto' => 'Camisa Flanela', 'categoria' => 'camisa', 'preco' => 99.90, 'marca' => 'Hollister', 'cor' => 'vermelho', 'genero' => 'masculino'],
            ['nome_produto' => 'Jaqueta de Couro', 'categoria' => 'jaqueta', 'preco' => 599.90, 'marca' => 'AllSaints', 'cor' => 'preto', 'genero' => 'unissex'],

            // Bottoms (10 produtos)
            ['nome_produto' => 'Calça Jeans Skinny', 'categoria' => 'calca', 'preco' => 159.90, 'marca' => 'Levi\'s', 'cor' => 'azul', 'genero' => 'feminino'],
            ['nome_produto' => 'Saia Midi Plissada', 'categoria' => 'saia', 'preco' => 129.90, 'marca' => 'Zara', 'cor' => 'preto', 'genero' => 'feminino'],
            ['nome_produto' => 'Short Jeans', 'categoria' => 'short', 'preco' => 89.90, 'marca' => 'H&M', 'cor' => 'azul', 'genero' => 'unissex'],
            ['nome_produto' => 'Legging Fitness', 'categoria' => 'legging', 'preco' => 79.90, 'marca' => 'Lululemon', 'cor' => 'preto', 'genero' => 'feminino'],
            ['nome_produto' => 'Bermuda Cargo', 'categoria' => 'bermuda', 'preco' => 99.90, 'marca' => 'Nike', 'cor' => 'verde', 'genero' => 'masculino'],
            ['nome_produto' => 'Jardineira Denim', 'categoria' => 'jardineira', 'preco' => 189.90, 'marca' => 'Gap', 'cor' => 'azul', 'genero' => 'unissex'],
            ['nome_produto' => 'Calça Social Preta', 'categoria' => 'calca', 'preco' => 199.90, 'marca' => 'Ralph Lauren', 'cor' => 'preto', 'genero' => 'masculino'],
            ['nome_produto' => 'Saia Longa Boho', 'categoria' => 'saia', 'preco' => 149.90, 'marca' => 'Free People', 'cor' => 'bege', 'genero' => 'feminino'],
            ['nome_produto' => 'Short Esportivo', 'categoria' => 'short', 'preco' => 69.90, 'marca' => 'Adidas', 'cor' => 'cinza', 'genero' => 'unissex'],
            ['nome_produto' => 'Legging de Yoga', 'categoria' => 'legging', 'preco' => 89.90, 'marca' => 'Athleta', 'cor' => 'roxo', 'genero' => 'feminino'],

            // Calçados (5 produtos)
            ['nome_produto' => 'Tênis Esportivo', 'categoria' => 'tenis', 'preco' => 299.90, 'marca' => 'Nike', 'cor' => 'branco', 'genero' => 'unissex'],
            ['nome_produto' => 'Sandália Gladiador', 'categoria' => 'sandalia', 'preco' => 129.90, 'marca' => 'Steve Madden', 'cor' => 'marrom', 'genero' => 'feminino'],
            ['nome_produto' => 'Bota de Couro', 'categoria' => 'bota', 'preco' => 399.90, 'marca' => 'Dr. Martens', 'cor' => 'preto', 'genero' => 'unissex'],
            ['nome_produto' => 'Sapato Social', 'categoria' => 'sapato', 'preco' => 249.90, 'marca' => 'Clarks', 'cor' => 'marrom', 'genero' => 'masculino'],
            ['nome_produto' => 'Chinelo Havaianas', 'categoria' => 'chinelo', 'preco' => 29.90, 'marca' => 'Havaianas', 'cor' => 'azul', 'genero' => 'unissex'],

            // Acessórios (5 produtos)
            ['nome_produto' => 'Cinto de Couro', 'categoria' => 'cinto', 'preco' => 79.90, 'marca' => 'Fossil', 'cor' => 'marrom', 'genero' => 'unissex'],
            ['nome_produto' => 'Óculos de Sol', 'categoria' => 'oculos', 'preco' => 199.90, 'marca' => 'Ray-Ban', 'cor' => 'preto', 'genero' => 'unissex'],
            ['nome_produto' => 'Bolsa Crossbody', 'categoria' => 'bolsa', 'preco' => 159.90, 'marca' => 'Michael Kors', 'cor' => 'preto', 'genero' => 'feminino'],
            ['nome_produto' => 'Relógio Analógico', 'categoria' => 'relogio', 'preco' => 299.90, 'marca' => 'Fossil', 'cor' => 'prateado', 'genero' => 'unissex'],
            ['nome_produto' => 'Brinco de Prata', 'categoria' => 'brinco', 'preco' => 89.90, 'marca' => 'Pandora', 'cor' => 'prateado', 'genero' => 'feminino'],

            // Acessórios de Cabeça (5 produtos)
            ['nome_produto' => 'Chapeu de Palha', 'categoria' => 'chapeu', 'preco' => 89.90, 'marca' => 'Eugenia Kim', 'cor' => 'bege', 'genero' => 'feminino'],
            ['nome_produto' => 'Boné Baseball', 'categoria' => 'bone', 'preco' => 49.90, 'marca' => 'New Era', 'cor' => 'preto', 'genero' => 'unissex'],
            ['nome_produto' => 'Tiara de Flores', 'categoria' => 'tiara', 'preco' => 39.90, 'marca' => 'ASOS', 'cor' => 'rosa', 'genero' => 'feminino'],
            ['nome_produto' => 'Lenço de Seda', 'categoria' => 'lenco', 'preco' => 69.90, 'marca' => 'Hermès', 'cor' => 'vermelho', 'genero' => 'unissex'],
            ['nome_produto' => 'Chapeu Fedora', 'categoria' => 'chapeu', 'preco' => 129.90, 'marca' => 'Stetson', 'cor' => 'marrom', 'genero' => 'unissex'],
        ];

        foreach ($produtos as $produtoData) {
            Produto::create(array_merge($produtoData, [
                'modelo' => \Faker\Factory::create()->word(),
                'estado_conservacao' => \Faker\Factory::create()->randomElement(['novo', 'seminovo', 'usado']),
                'estacao' => \Faker\Factory::create()->randomElement(['verao', 'outono', 'inverno', 'primavera', 'todas']),
                'numeracao' => \Faker\Factory::create()->randomElement(['P', 'M', 'G', 'GG', '36', '38', '40', '42', '44', '46']),
                'ocasioes' => \Faker\Factory::create()->randomElements(['trabalho', 'festa', 'casual', 'esporte', 'praia', 'balada', 'dia a dia'], \Faker\Factory::create()->numberBetween(1, 3)),
                'estilos' => \Faker\Factory::create()->randomElements(['classico', 'moderno', 'boho', 'minimalista', 'rocker', 'romantico', 'esportivo', 'urbano', 'vintage'], \Faker\Factory::create()->numberBetween(1, 3)),
                'material' => \Faker\Factory::create()->randomElement(['algodao', 'linho', 'la', 'seda', 'jeans', 'couro', 'moletom', 'viscose', 'poliester']),
            ]));
        }

        echo "40 produtos criados com sucesso!\n";
    }
}
