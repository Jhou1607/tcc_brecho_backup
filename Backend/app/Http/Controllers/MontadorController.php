<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Models\Usuario;

class MontadorController extends Controller
{
    public function getItensDisponiveis()
    {
        $usuario = Auth::user();

        $produtosUsuario = $usuario->produtosProprios()->with('imagens')->get()->map(function ($produto) {
            $produto->tipo_id_prefixo = 'user_';
            return $produto;
        });

        $produtosFavoritos = $usuario->favoritos()->with('imagens')->get()->map(function ($produto) {
            $produto->tipo_id_prefixo = 'store_';
            return $produto;
        });

        $todosOsItens = $produtosUsuario->concat($produtosFavoritos)->unique(function ($item) {
            return $item->tipo_id_prefixo . $item->id;
        });

        // Novo: mapear grupo de origem para cada categoria 'Outro'
        $categoriaParaGrupo = [
            // Acessórios de Cabeça
            'chapeu' => 'Acessórios de Cabeça', 'tiara' => 'Acessórios de Cabeça', 'bone' => 'Acessórios de Cabeça', 'boné' => 'Acessórios de Cabeça', 'lenço' => 'Acessórios de Cabeça', 'lenco' => 'Acessórios de Cabeça',
            // Tops
            'camiseta' => 'Tops', 'camisa' => 'Tops', 'blusa' => 'Tops', 'jaqueta' => 'Tops', 'casaco' => 'Tops', 'suéter' => 'Tops', 'sueter' => 'Tops', 'regata' => 'Tops', 'colete' => 'Tops', 'vestido' => 'Tops', 'macacao' => 'Tops', 'macacão' => 'Tops', 'blazer' => 'Tops',
            // Calças e Saias
            'calca' => 'Calças e Saias', 'calça' => 'Calças e Saias', 'bermuda' => 'Calças e Saias', 'short' => 'Calças e Saias', 'shorts' => 'Calças e Saias', 'saia' => 'Calças e Saias', 'legging' => 'Calças e Saias', 'jardineira' => 'Calças e Saias',
            // Calçados
            'calcado' => 'Calçados', 'calçado' => 'Calçados', 'sapato' => 'Calçados', 'tenis' => 'Calçados', 'tênis' => 'Calçados', 'salto' => 'Calçados', 'chinelo' => 'Calçados', 'bota' => 'Calçados', 'sandália' => 'Calçados', 'sandalia' => 'Calçados',
            // Acessórios
            'cinto' => 'Acessórios', 'óculos' => 'Acessórios', 'oculos' => 'Acessórios', 'bolsa' => 'Acessórios', 'relógio' => 'Acessórios', 'relogio' => 'Acessórios', 'brinco' => 'Acessórios', 'colar' => 'Acessórios', 'pulseira' => 'Acessórios', 'anel' => 'Acessórios',
        ];

        $itensComSuperCategoria = $todosOsItens->map(function ($item) use ($categoriaParaGrupo) {
            $categoria = $item->categoria ?? 'acessorio';
            $categoriaLower = strtolower($categoria);
            $grupoOrigem = $categoriaParaGrupo[$categoriaLower] ?? null;
            $item->super_categoria = $this->mapearParaSuperCategoria($categoria, $grupoOrigem);
            return $item;
        });

        $itensAgrupados = $itensComSuperCategoria->groupBy('super_categoria');

        $ordemDesejada = ['Acessórios de Cabeça', 'Tops', 'Calças e Saias', 'Calçados', 'Acessórios'];

        $gruposFormatados = $itensAgrupados->map(function ($itens, $categoriaNome) use ($ordemDesejada) {
            return [
                'id' => crc32($categoriaNome),
                'name' => $categoriaNome,
                'icon' => $this->getIconeParaCategoria($categoriaNome),
                'items' => $itens->map(function ($item) {
                    $imagemPrincipal = $item->imagens->firstWhere('is_principal', true) ?? $item->imagens->first();
                    $origem = $item->tipo_id_prefixo === 'user_' ? 'user' : 'catalog';
                    return [
                        'id' =>  $item->id,
                        'name' => $item->nome_produto,
                        'thumbnailUrl' => $imagemPrincipal ? Storage::url($imagemPrincipal->url) : null,
                        'canvasUrl' => $imagemPrincipal ? url('/api/storage/' . $imagemPrincipal->url) : null,
                        'favorited' => false,
                        'origem' => $origem
                    ];
                })->filter(function ($item) {
                    return $item['thumbnailUrl'] !== null;
                })->values()->toArray(),
                'placeholder' => null,
                'ordem' => array_search($categoriaNome, $ordemDesejada)
            ];
        })->sortBy('ordem')->values();

        return response()->json($gruposFormatados);
    }

    private function mapearParaSuperCategoria(string $categoriaOriginal, ?string $grupoOrigem = null): string
    {
        $categoriaLower = strtolower($categoriaOriginal);

        $mapa = [
            'Acessórios de Cabeça' => ['chapéu', 'chapeu', 'tiara', 'boné', 'bone', 'lenço', 'lenco'],
            'Tops' => ['camiseta', 'camisa', 'blusa', 'jaqueta', 'casaco', 'suéter', 'sueter', 'regata', 'colete'],
            'Calças e Saias' => ['calça', 'calca', 'saia', 'shorts', 'short', 'legging', 'bermuda', 'jardineira'],
            'Calçados' => ['tênis', 'tenis', 'bota', 'sapato', 'chinelo'],
            'Acessórios' => ['cinto', 'óculos', 'oculos', 'bolsa', 'relógio', 'relogio', 'brinco', 'colar', 'pulseira', 'anel'],
        ];

        // Se for 'Outro', retorna o grupo de origem se informado
        if ($categoriaLower === 'outro' && $grupoOrigem) {
            return $grupoOrigem;
        }

        foreach ($mapa as $superCategoria => $categoriasFilhas) {
            if (in_array($categoriaLower, $categoriasFilhas)) {
                return $superCategoria;
            }
        }

        return 'Acessórios';
    }

    private function getIconeParaCategoria(string $superCategoria): string
    {
        $icones = [
            'Acessórios de Cabeça' => '/assets/images/icon-chapeu.png',
            'Tops' => '/assets/images/icon-camisa.png',
            'Calças e Saias' => '/assets/images/icon-calca.png',
            'Calçados' => '/assets/images/icon-sapatos.png',
            'Acessórios' => '/assets/images/icon-acessorio.png',
        ];

        return $icones[$superCategoria] ?? '/assets/images/icon-default.png';
    }
}
