<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Produto;
use App\Models\ProdutoUsuario;
use App\Models\Armario;
use App\Models\Imagem;
use App\Models\Usuario;
use Illuminate\Support\Str;

class RealProdutoSeeder extends Seeder
{
    public function run(): void
    {
        // Apaga todos os produtos, produtos de usuário, armários e imagens anteriores
        \App\Models\Armario::query()->delete(); 
        \App\Models\ProdutoUsuario::query()->delete();
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
            [
                'nome_produto' => 'Tank Top Esportivo',
                'categoria' => 'tank-top',
                'preco' => 35.00,
                'marca' => 'Nike',
                'cor' => 'preto',
                'genero' => 'feminino',
                'estado_conservacao' => 'novo',
                'estacao' => 'verao',
                'numeracao' => 'M',
                'ocasioes' => ['esporte', 'academia'],
                'estilos' => ['esportivo', 'moderno'],
                'material' => 'dry-fit',
                'imagem' => 'tank-top-esportivo.jpg'
            ],
            [
                'nome_produto' => 'Polo Clássico',
                'categoria' => 'polo',
                'preco' => 65.00,
                'marca' => 'Lacoste',
                'cor' => 'verde',
                'genero' => 'masculino',
                'estado_conservacao' => 'seminovo',
                'estacao' => 'todas',
                'numeracao' => 'M',
                'ocasioes' => ['trabalho', 'casual'],
                'estilos' => ['classico', 'elegante'],
                'material' => 'piquet',
                'imagem' => 'polo-classico.jpg'
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
            [
                'nome_produto' => 'Calça Social Slim',
                'categoria' => 'calca',
                'preco' => 85.00,
                'marca' => 'Riachuelo',
                'cor' => 'preto',
                'genero' => 'masculino',
                'estado_conservacao' => 'novo',
                'estacao' => 'todas',
                'numeracao' => '42',
                'ocasioes' => ['trabalho', 'evento'],
                'estilos' => ['elegante', 'moderno'],
                'material' => 'poliester',
                'imagem' => 'calca-social-slim.jpg'
            ],
            [
                'nome_produto' => 'Saia Longa Boho',
                'categoria' => 'saia',
                'preco' => 75.00,
                'marca' => 'Brechó',
                'cor' => 'estampada',
                'genero' => 'feminino',
                'estado_conservacao' => 'seminovo',
                'estacao' => 'verao',
                'numeracao' => 'L',
                'ocasioes' => ['festa', 'casual'],
                'estilos' => ['boho', 'romantico'],
                'material' => 'algodao',
                'imagem' => 'saia-longa-boho.jpg'
            ],
            [
                'nome_produto' => 'Bermuda Cargo',
                'categoria' => 'bermuda',
                'preco' => 55.00,
                'marca' => 'Brechó',
                'cor' => 'verde',
                'genero' => 'masculino',
                'estado_conservacao' => 'usado',
                'estacao' => 'verao',
                'numeracao' => '40',
                'ocasioes' => ['casual', 'praia'],
                'estilos' => ['casual', 'utilitario'],
                'material' => 'algodao',
                'imagem' => 'bermuda-cargo.jpg'
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
            [
                'nome_produto' => 'Sapato Social Oxford',
                'categoria' => 'sapato',
                'preco' => 150.00,
                'marca' => 'Brechó',
                'cor' => 'preto',
                'genero' => 'masculino',
                'estado_conservacao' => 'seminovo',
                'estacao' => 'todas',
                'numeracao' => '41',
                'ocasioes' => ['trabalho', 'evento'],
                'estilos' => ['elegante', 'classico'],
                'material' => 'couro',
                'imagem' => 'sapato-oxford.jpg'
            ],
            [
                'nome_produto' => 'Bota Ankle Boot',
                'categoria' => 'bota',
                'preco' => 95.00,
                'marca' => 'Brechó',
                'cor' => 'marrom',
                'genero' => 'feminino',
                'estado_conservacao' => 'usado',
                'estacao' => 'inverno',
                'numeracao' => '38',
                'ocasioes' => ['casual', 'trabalho'],
                'estilos' => ['casual', 'elegante'],
                'material' => 'couro',
                'imagem' => 'bota-ankle-boot.jpg'
            ],
            [
                'nome_produto' => 'Sapatilha de Ballet',
                'categoria' => 'sapatilha',
                'preco' => 45.00,
                'marca' => 'Brechó',
                'cor' => 'rosa',
                'genero' => 'feminino',
                'estado_conservacao' => 'seminovo',
                'estacao' => 'todas',
                'numeracao' => '36',
                'ocasioes' => ['danca', 'casual'],
                'estilos' => ['elegante', 'feminino'],
                'material' => 'seda',
                'imagem' => 'sapatilha-ballet.jpg'
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
            [
                'nome_produto' => 'Mochila Escolar Vintage',
                'categoria' => 'mochila',
                'preco' => 55.00,
                'marca' => 'Brechó',
                'cor' => 'azul',
                'genero' => 'unissex',
                'estado_conservacao' => 'usado',
                'estacao' => 'todas',
                'numeracao' => 'unico',
                'ocasioes' => ['escola', 'casual'],
                'estilos' => ['vintage', 'casual'],
                'material' => 'lona',
                'imagem' => 'mochila-escolar-vintage.jpg'
            ],
            [
                'nome_produto' => 'Carteira de Couro',
                'categoria' => 'carteira',
                'preco' => 35.00,
                'marca' => 'Brechó',
                'cor' => 'preto',
                'genero' => 'unissex',
                'estado_conservacao' => 'seminovo',
                'estacao' => 'todas',
                'numeracao' => 'unico',
                'ocasioes' => ['trabalho', 'casual'],
                'estilos' => ['classico', 'elegante'],
                'material' => 'couro',
                'imagem' => 'carteira-couro.jpg'
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
            ],
            [
                'nome_produto' => 'Tiara de Flores',
                'categoria' => 'tiara',
                'preco' => 25.00,
                'marca' => 'Brechó',
                'cor' => 'rosa',
                'genero' => 'feminino',
                'estado_conservacao' => 'novo',
                'estacao' => 'primavera',
                'numeracao' => 'unico',
                'ocasioes' => ['festa', 'casual'],
                'estilos' => ['romantico', 'feminino'],
                'material' => 'plastico',
                'imagem' => 'tiara-flores.jpg'
            ],
            [
                'nome_produto' => 'Lenço de Seda Estampado',
                'categoria' => 'lenco',
                'preco' => 35.00,
                'marca' => 'Brechó',
                'cor' => 'estampado',
                'genero' => 'feminino',
                'estado_conservacao' => 'seminovo',
                'estacao' => 'todas',
                'numeracao' => 'unico',
                'ocasioes' => ['trabalho', 'elegante'],
                'estilos' => ['elegante', 'classico'],
                'material' => 'seda',
                'imagem' => 'lenco-seda-estampado.jpg'
            ],
            [
                'nome_produto' => 'Gorro de Lã Tricotado',
                'categoria' => 'gorro',
                'preco' => 30.00,
                'marca' => 'Brechó',
                'cor' => 'vermelho',
                'genero' => 'unissex',
                'estado_conservacao' => 'usado',
                'estacao' => 'inverno',
                'numeracao' => 'unico',
                'ocasioes' => ['casual', 'inverno'],
                'estilos' => ['casual', 'confortavel'],
                'material' => 'la',
                'imagem' => 'gorro-la-tricotado.jpg'
            ],

            // === VESTIDOS ===
            [
                'nome_produto' => 'Vestido Floral Midi',
                'categoria' => 'vestido',
                'preco' => 85.00,
                'marca' => 'Brechó',
                'cor' => 'estampado',
                'genero' => 'feminino',
                'estado_conservacao' => 'seminovo',
                'estacao' => 'primavera',
                'numeracao' => 'M',
                'ocasioes' => ['festa', 'casual'],
                'estilos' => ['romantico', 'feminino'],
                'material' => 'algodao',
                'imagem' => 'vestido-floral-midi.jpg'
            ],
            [
                'nome_produto' => 'Vestido Preto Elegante',
                'categoria' => 'vestido',
                'preco' => 95.00,
                'marca' => 'Brechó',
                'cor' => 'preto',
                'genero' => 'feminino',
                'estado_conservacao' => 'novo',
                'estacao' => 'todas',
                'numeracao' => 'P',
                'ocasioes' => ['festa', 'evento'],
                'estilos' => ['elegante', 'classico'],
                'material' => 'poliester',
                'imagem' => 'vestido-preto-elegante.jpg'
            ],

            // === MACACÕES ===
            [
                'nome_produto' => 'Macacão Jeans',
                'categoria' => 'macacao',
                'preco' => 75.00,
                'marca' => 'Brechó',
                'cor' => 'azul',
                'genero' => 'feminino',
                'estado_conservacao' => 'usado',
                'estacao' => 'todas',
                'numeracao' => 'M',
                'ocasioes' => ['casual', 'trabalho'],
                'estilos' => ['casual', 'utilitario'],
                'material' => 'jeans',
                'imagem' => 'macacao-jeans.jpg'
            ],

            // === COATS E CASACOS ===
            [
                'nome_produto' => 'Casaco de Lã Oversized',
                'categoria' => 'casaco',
                'preco' => 120.00,
                'marca' => 'Brechó',
                'cor' => 'bege',
                'genero' => 'feminino',
                'estado_conservacao' => 'seminovo',
                'estacao' => 'inverno',
                'numeracao' => 'L',
                'ocasioes' => ['casual', 'elegante'],
                'estilos' => ['moderno', 'confortavel'],
                'material' => 'la',
                'imagem' => 'casaco-la-oversized.jpg'
            ],
            [
                'nome_produto' => 'Blazer Clássico',
                'categoria' => 'blazer',
                'preco' => 110.00,
                'marca' => 'Brechó',
                'cor' => 'azul-marinho',
                'genero' => 'unissex',
                'estado_conservacao' => 'seminovo',
                'estacao' => 'todas',
                'numeracao' => 'M',
                'ocasioes' => ['trabalho', 'evento'],
                'estilos' => ['elegante', 'profissional'],
                'material' => 'poliester',
                'imagem' => 'blazer-classico.jpg'
            ]
        ];

        // Obter usuários para associar produtos
        $usuarios = Usuario::all();
        
        if ($usuarios->isEmpty()) {
            echo "Erro: Nenhum usuário encontrado. Execute o UsuarioSeeder primeiro.\n";
            return;
        }
        
        // Colocar todos os produtos em todas as tabelas
        $produtosLoja = $produtos; // Todos os produtos para a loja
        $produtosUsuario = $produtos; // Todos os produtos para produto_usuario
        $produtosFavoritos = $produtos; // Todos os produtos da loja para favoritos no armário
        $produtosUsuarioArmario = $produtos; // Todos os produtos de usuário para o armário
        
        // 1. Criar produtos da loja
        foreach ($produtosLoja as $produtoData) {
            $imagem = $produtoData['imagem'];
            unset($produtoData['imagem']);

            $produto = Produto::create($produtoData);

            // Criar imagem para o produto
            Imagem::create([
                'imageable_id' => $produto->id,
                'imageable_type' => Produto::class,
                'url' => 'produtos/' . $imagem,
                'is_principal' => true,
            ]);
        }
        
        // 2. Criar produtos de usuário (sem preço)
        foreach ($produtosUsuario as $produtoData) {
            $imagem = $produtoData['imagem'];
            
            // Criar uma cópia dos dados para não afetar o array original
            $produtoUsuarioData = $produtoData;
            
            // Remover campos que não existem na tabela produto_usuarios
            unset($produtoUsuarioData['preco']);
            unset($produtoUsuarioData['estado_conservacao']);
            unset($produtoUsuarioData['numeracao']);
            unset($produtoUsuarioData['genero']);
            unset($produtoUsuarioData['imagem']); // Remover o campo imagem também
            
            // Associar ao usuário jc.chiavelli@unesp.br
            $usuario = Usuario::where('email', 'jc.chiavelli@unesp.br')->first();
            
            // Se não encontrar o usuário específico, usar o primeiro usuário disponível
            if (!$usuario) {
                $usuario = $usuarios->first();
                echo "Aviso: Usuário jc.chiavelli@unesp.br não encontrado. Usando o primeiro usuário disponível.\n";
            }
            
            $produtoUsuario = ProdutoUsuario::create(array_merge($produtoUsuarioData, [
                'usuario_id' => $usuario->id,
            ]));

            // Criar imagem para o produto de usuário
            Imagem::create([
                'imageable_id' => $produtoUsuario->id,
                'imageable_type' => ProdutoUsuario::class,
                'url' => 'produtos/' . $imagem,
                'is_principal' => true,
            ]);
        }
        
        // 3. Adicionar produtos da loja ao armário (como favoritos - mantém o preço)
        // Obter o usuário jc.chiavelli@unesp.br
        $usuario = Usuario::where('email', 'jc.chiavelli@unesp.br')->first();
        
        // Se não encontrar o usuário específico, usar o primeiro usuário disponível
        if (!$usuario) {
            $usuario = $usuarios->first();
            echo "Aviso: Usuário jc.chiavelli@unesp.br não encontrado. Usando o primeiro usuário disponível.\n";
        }
        
        // Obter todos os produtos da loja
        $produtosLojaCriados = Produto::all();
        
        foreach ($produtosLojaCriados as $produto) {
            // Adicionar ao armário
            Armario::create([
                'usuario_id' => $usuario->id,
                'item_id' => $produto->id,
                'item_type' => Produto::class,
            ]);
            
            // Adicionar aos favoritos
            $produto->favoritos()->attach($usuario->id);
        }
        
        // 4. Adicionar produtos de usuário ao armário (sem preço)
        // Obter todos os produtos de usuário
        $produtosUsuarioCriados = ProdutoUsuario::all();
        
        foreach ($produtosUsuarioCriados as $produtoUsuario) {
            // Adicionar ao armário do mesmo usuário que criou o produto
            Armario::create([
                'usuario_id' => $produtoUsuario->usuario_id,
                'item_id' => $produtoUsuario->id,
                'item_type' => ProdutoUsuario::class,
            ]);
        }

        echo count($produtosLoja) . " produtos da loja criados com sucesso!\n";
        echo count($produtosUsuarioCriados) . " produtos de usuário criados com sucesso!\n";
        echo count($produtosLojaCriados) . " produtos da loja adicionados como favoritos no armário!\n";
        echo count($produtosUsuarioCriados) . " produtos de usuário adicionados ao armário!\n";
        echo "TODOS OS PRODUTOS FORAM ADICIONADOS EM TODAS AS TABELAS COM SUCESSO!\n";
        echo "IMPORTANTE: Adicione as imagens correspondentes na pasta storage/app/public/produtos/\n";
        echo "Nomes das imagens necessárias:\n";
        foreach ($produtos as $produto) {
            echo "- " . $produto['imagem'] . "\n";
        }
    }
}
