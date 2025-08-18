<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Produto;
use App\Models\Imagem;
use Illuminate\Support\Str;

class RealProdutoSeeder extends Seeder
{
    public function run(): void
    {
        // Apaga todos os produtos e imagens anteriores
        \App\Models\Produto::query()->delete();
        \App\Models\Imagem::query()->delete();

        $produtos = [
            // === TOPS ===
            [
                'nome_produto' => 'Camiseta Básica de Algodão',
                'categoria' => 'camiseta',
                'preco' => 45.00,
                'marca' => 'C&A',
                'cor' => 'branco',
                'genero' => 'unissex',
                'estado_conservacao' => 'seminovo',
                'estacao' => 'todas',
                'numeracao' => 'M',
                'ocasioes' => ['casual', 'dia a dia'],
                'estilos' => ['minimalista', 'basico'],
                'material' => 'algodao',
                'imagem' => 'camiseta-basica-branca.jpg'
            ],
            [
                'nome_produto' => 'Blusa de Seda Estampada',
                'categoria' => 'blusa',
                'preco' => 75.00,
                'marca' => 'Renner',
                'cor' => 'azul',
                'genero' => 'feminino',
                'estado_conservacao' => 'novo',
                'estacao' => 'primavera',
                'numeracao' => 'P',
                'ocasioes' => ['trabalho', 'festa'],
                'estilos' => ['elegante', 'moderno'],
                'material' => 'seda',
                'imagem' => 'blusa-seda-estampada.jpg'
            ],
            [
                'nome_produto' => 'Camisa Social de Linho',
                'categoria' => 'camisa',
                'preco' => 120.00,
                'marca' => 'Riachuelo',
                'cor' => 'bege',
                'genero' => 'masculino',
                'estado_conservacao' => 'seminovo',
                'estacao' => 'verao',
                'numeracao' => 'G',
                'ocasioes' => ['trabalho', 'casual'],
                'estilos' => ['classico', 'elegante'],
                'material' => 'linho',
                'imagem' => 'camisa-social-linho.jpg'
            ],
            [
                'nome_produto' => 'Jaqueta Jeans Vintage',
                'categoria' => 'jaqueta',
                'preco' => 95.00,
                'marca' => 'Brechó',
                'cor' => 'azul',
                'genero' => 'unissex',
                'estado_conservacao' => 'usado',
                'estacao' => 'todas',
                'numeracao' => 'M',
                'ocasioes' => ['casual', 'balada'],
                'estilos' => ['vintage', 'rocker'],
                'material' => 'jeans',
                'imagem' => 'jaqueta-jeans-vintage.jpg'
            ],
            [
                'nome_produto' => 'Suéter de Lã Tricotado',
                'categoria' => 'sueter',
                'preco' => 85.00,
                'marca' => 'Brechó',
                'cor' => 'cinza',
                'genero' => 'unissex',
                'estado_conservacao' => 'seminovo',
                'estacao' => 'inverno',
                'numeracao' => 'G',
                'ocasioes' => ['casual', 'dia a dia'],
                'estilos' => ['casual', 'confortavel'],
                'material' => 'la',
                'imagem' => 'sueter-la-tricotado.jpg'
            ],

            // === CALÇAS E SAIAS ===
            [
                'nome_produto' => 'Calça Jeans Skinny',
                'categoria' => 'calca',
                'preco' => 65.00,
                'marca' => 'Brechó',
                'cor' => 'azul',
                'genero' => 'feminino',
                'estado_conservacao' => 'usado',
                'estacao' => 'todas',
                'numeracao' => '38',
                'ocasioes' => ['casual', 'dia a dia'],
                'estilos' => ['moderno', 'basico'],
                'material' => 'jeans',
                'imagem' => 'calca-jeans-skinny.jpg'
            ],
            [
                'nome_produto' => 'Saia Midi Plissada',
                'categoria' => 'saia',
                'preco' => 55.00,
                'marca' => 'Brechó',
                'cor' => 'preto',
                'genero' => 'feminino',
                'estado_conservacao' => 'seminovo',
                'estacao' => 'todas',
                'numeracao' => 'M',
                'ocasioes' => ['trabalho', 'festa'],
                'estilos' => ['elegante', 'classico'],
                'material' => 'poliester',
                'imagem' => 'saia-midi-plissada.jpg'
            ],
            [
                'nome_produto' => 'Short Jeans Desbotado',
                'categoria' => 'short',
                'preco' => 45.00,
                'marca' => 'Brechó',
                'cor' => 'azul',
                'genero' => 'unissex',
                'estado_conservacao' => 'usado',
                'estacao' => 'verao',
                'numeracao' => 'M',
                'ocasioes' => ['casual', 'praia'],
                'estilos' => ['casual', 'vintage'],
                'material' => 'jeans',
                'imagem' => 'short-jeans-desbotado.jpg'
            ],

            // === CALÇADOS ===
            [
                'nome_produto' => 'Tênis Converse All Star',
                'categoria' => 'tenis',
                'preco' => 120.00,
                'marca' => 'Converse',
                'cor' => 'branco',
                'genero' => 'unissex',
                'estado_conservacao' => 'seminovo',
                'estacao' => 'todas',
                'numeracao' => '40',
                'ocasioes' => ['casual', 'esporte'],
                'estilos' => ['classico', 'casual'],
                'material' => 'lona',
                'imagem' => 'tenis-converse-allstar.jpg'
            ],
            [
                'nome_produto' => 'Sandália Rasteira de Couro',
                'categoria' => 'sandalia',
                'preco' => 35.00,
                'marca' => 'Brechó',
                'cor' => 'marrom',
                'genero' => 'feminino',
                'estado_conservacao' => 'usado',
                'estacao' => 'verao',
                'numeracao' => '37',
                'ocasioes' => ['casual', 'praia'],
                'estilos' => ['casual', 'boho'],
                'material' => 'couro',
                'imagem' => 'sandalia-rasteira-couro.jpg'
            ],

            // === ACESSÓRIOS ===
            [
                'nome_produto' => 'Bolsa de Couro Crossbody',
                'categoria' => 'bolsa',
                'preco' => 65.00,
                'marca' => 'Brechó',
                'cor' => 'marrom',
                'genero' => 'feminino',
                'estado_conservacao' => 'seminovo',
                'estacao' => 'todas',
                'numeracao' => 'unico',
                'ocasioes' => ['trabalho', 'casual'],
                'estilos' => ['elegante', 'classico'],
                'material' => 'couro',
                'imagem' => 'bolsa-couro-crossbody.jpg'
            ],
            [
                'nome_produto' => 'Cinto de Couro Marrom',
                'categoria' => 'cinto',
                'preco' => 25.00,
                'marca' => 'Brechó',
                'cor' => 'marrom',
                'genero' => 'unissex',
                'estado_conservacao' => 'usado',
                'estacao' => 'todas',
                'numeracao' => 'M',
                'ocasioes' => ['trabalho', 'casual'],
                'estilos' => ['classico', 'basico'],
                'material' => 'couro',
                'imagem' => 'cinto-couro-marrom.jpg'
            ],

            // === ACESSÓRIOS DE CABEÇA ===
            [
                'nome_produto' => 'Chapéu de Palha Natural',
                'categoria' => 'chapeu',
                'preco' => 40.00,
                'marca' => 'Brechó',
                'cor' => 'bege',
                'genero' => 'unissex',
                'estado_conservacao' => 'seminovo',
                'estacao' => 'verao',
                'numeracao' => 'unico',
                'ocasioes' => ['praia', 'casual'],
                'estilos' => ['boho', 'casual'],
                'material' => 'palha',
                'imagem' => 'chapeu-palha-natural.jpg'
            ],
            [
                'nome_produto' => 'Boné Baseball Vintage',
                'categoria' => 'bone',
                'preco' => 30.00,
                'marca' => 'Brechó',
                'cor' => 'azul',
                'genero' => 'unissex',
                'estado_conservacao' => 'usado',
                'estacao' => 'todas',
                'numeracao' => 'unico',
                'ocasioes' => ['casual', 'esporte'],
                'estilos' => ['casual', 'vintage'],
                'material' => 'algodao',
                'imagem' => 'bone-baseball-vintage.jpg'
            ]
        ];

        foreach ($produtos as $produtoData) {
            $imagem = $produtoData['imagem'];
            unset($produtoData['imagem']);

            $produto = Produto::create(array_merge($produtoData, [
                'modelo' => Str::slug($produtoData['nome_produto']),
            ]));

            // Criar imagem para o produto
            Imagem::create([
                'produto_id' => $produto->id,
                'url' => 'produtos/' . $imagem,
                'is_principal' => true,
            ]);
        }

        echo count($produtos) . " produtos reais criados com sucesso!\n";
        echo "IMPORTANTE: Adicione as imagens correspondentes na pasta storage/app/public/produtos/\n";
        echo "Nomes das imagens necessárias:\n";
        foreach ($produtos as $produto) {
            echo "- " . $produto['imagem'] . "\n";
        }
    }
}
