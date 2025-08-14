<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Produto;
use App\Models\ProdutoUsuario;
use App\Models\Imagem;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImagemSeeder extends Seeder
{
    public function run(): void
    {
        Imagem::query()->delete();
        Storage::disk('public')->deleteDirectory('produtos');
        Storage::disk('public')->deleteDirectory('produtos_usuarios');
        Storage::disk('public')->makeDirectory('produtos');
        Storage::disk('public')->makeDirectory('produtos_usuarios');

        // Criar imagens para produtos do catálogo
        $produtos = \App\Models\Produto::all();
        echo "Criando imagens para " . $produtos->count() . " produtos do catálogo...\n";
        foreach ($produtos as $produto) {
            $this->criarImagemParaProduto($produto, 'produtos');
        }

        // Criar imagens para produtos do usuário
        $produtosUsuarios = \App\Models\ProdutoUsuario::all();
        echo "Criando imagens para " . $produtosUsuarios->count() . " produtos do usuário...\n";
        foreach ($produtosUsuarios as $produtoUsuario) {
            $this->criarImagemParaProduto($produtoUsuario, 'produtos_usuarios');
        }
        
        echo "Processo de criação de imagens concluído!\n";
    }

    private function criarImagemParaProduto($produto, $pasta)
    {
        // Criar diretório se não existir
        Storage::disk('public')->makeDirectory($pasta);

        // Gerar nome único para a imagem
        $nomeArquivo = Str::random(10) . '_' . $produto->id . '_img.jpg';
        $caminhoCompleto = $pasta . '/' . $nomeArquivo;

        try {
            // Criar imagem localmente usando GD
            $conteudo = $this->criarImagemLocal($produto->categoria, $produto->cor ?? 'preto', $produto->nome_produto);

            // Salvar no storage
            Storage::disk('public')->put($caminhoCompleto, $conteudo);

            // Criar registro na tabela de imagens
            \App\Models\Imagem::create([
                'imageable_type' => get_class($produto),
                'imageable_id' => $produto->id,
                'url' => $caminhoCompleto,
                'is_principal' => true
            ]);

            echo "Imagem criada para produto ID {$produto->id} ({$produto->nome_produto})\n";

        } catch (\Exception $e) {
            echo "Erro ao processar imagem para produto ID {$produto->id}: " . $e->getMessage() . "\n";
        }
    }

    private function criarImagemLocal($categoria, $cor, $nomeProduto)
    {
        // Cores em RGB
        $cores = [
            'preto' => [0, 0, 0],
            'branco' => [255, 255, 255],
            'azul' => [0, 102, 204],
            'vermelho' => [204, 0, 0],
            'verde' => [0, 204, 0],
            'amarelo' => [255, 255, 0],
            'rosa' => [255, 105, 180],
            'roxo' => [128, 0, 128],
            'laranja' => [255, 165, 0],
            'marrom' => [139, 69, 19],
            'cinza' => [128, 128, 128],
            'bege' => [245, 245, 220],
            'prateado' => [192, 192, 192]
        ];

        $rgb = $cores[$cor] ?? [0, 0, 0];

        // Criar imagem
        $imagem = imagecreate(600, 800);
        
        // Definir cores
        $corFundo = imagecolorallocate($imagem, $rgb[0], $rgb[1], $rgb[2]);
        $corTexto = imagecolorallocate($imagem, 255, 255, 255);
        $corBorda = imagecolorallocate($imagem, 0, 0, 0);
        
        // Preencher fundo
        imagefill($imagem, 0, 0, $corFundo);
        
        // Desenhar borda
        imagerectangle($imagem, 0, 0, 599, 799, $corBorda);
        
        // Adicionar texto centralizado
        $texto = ucfirst($categoria);
        $fontSize = 5;
        $textWidth = strlen($texto) * imagefontwidth($fontSize);
        $textHeight = imagefontheight($fontSize);
        $x = (600 - $textWidth) / 2;
        $y = (800 - $textHeight) / 2;
        
        imagestring($imagem, $fontSize, $x, $y, $texto, $corTexto);
        
        // Adicionar nome do produto
        $nomeTexto = substr($nomeProduto, 0, 20);
        $nomeWidth = strlen($nomeTexto) * imagefontwidth(3);
        $nomeX = (600 - $nomeWidth) / 2;
        imagestring($imagem, 3, $nomeX, $y + 50, $nomeTexto, $corTexto);
        
        // Capturar a saída
        ob_start();
        imagejpeg($imagem, null, 90);
        $conteudo = ob_get_contents();
        ob_end_clean();
        
        imagedestroy($imagem);
        return $conteudo;
    }
}
