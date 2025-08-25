<?php

namespace App\Http\Controllers;

use App\Models\Imagem;
use App\Models\Produto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class ProdutoController extends Controller
{
    private function addFavoritedStatusToProducts($products, $user = null)
    {
        if (!$user) {
            if ($products instanceof \Illuminate\Contracts\Pagination\LengthAwarePaginator) {
                $products->getCollection()->transform(function ($produto) {
                    $produto->is_favorited = false;
                    return $produto;
                });
            } elseif ($products instanceof \Illuminate\Database\Eloquent\Collection) {
                 $products->transform(function ($produto) {
                    $produto->is_favorited = false;
                    return $produto;
                });
            } elseif ($products instanceof Produto) {
                $products->is_favorited = false;
            }
            return $products;
        }

        if ($products instanceof \Illuminate\Contracts\Pagination\LengthAwarePaginator) {
            $productIdsFavoritedByUser = $user->favoritos()->pluck('produtos.id')->flip();
            $products->getCollection()->transform(function ($produto) use ($productIdsFavoritedByUser) {
                $produto->is_favorited = $productIdsFavoritedByUser->has($produto->id);
                return $produto;
            });
        } elseif ($products instanceof \Illuminate\Database\Eloquent\Collection) {
            $productIdsFavoritedByUser = $user->favoritos()->pluck('produtos.id')->flip();
            $products->transform(function ($produto) use ($productIdsFavoritedByUser) {
                $produto->is_favorited = $productIdsFavoritedByUser->has($produto->id);
                return $produto;
            });
        } elseif ($products instanceof Produto) {
            $products->is_favorited = $user->favoritos()->where('produto_id', $products->id)->exists();
        }
        return $products;
    }

    public function index(Request $request)
    {
        Log::info('--- Iniciando ProdutoController@index ---');
        try {
            $query = Produto::query();
            $perPage = $request->get('per_page', 8);
            $produtos = $query->with('imagens')->latest()->paginate($perPage);

            $user = Auth::guard('sanctum')->user();
            $this->addFavoritedStatusToProducts($produtos, $user);

            Log::info('Produtos carregados com sucesso para o catálogo.');
            return response()->json([
                'success' => true,
                'data' => $produtos
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erro em ProdutoController@index: ' . $e->getMessage(), [
                'arquivo' => $e->getFile(),
                'linha' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Erro interno do servidor ao buscar produtos.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    public function getFiltros()
    {
        try {
            // Buscar filtros administráveis ativos
            $adminFilterOptions = \App\Models\AdminFilterOption::active()
                ->ordered()
                ->get()
                ->groupBy('filter_type');
            
            $filtros = [];
            foreach ($adminFilterOptions as $type => $options) {
                $filtros[$type] = $options->pluck('label')->toArray();
            }
            
            return response()->json([
                'success' => true,
                'data' => $filtros
            ]);
        } catch (\Exception $e) {
            Log::error('Erro em ProdutoController@getFiltros: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erro ao buscar filtros.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        Log::info('--- Iniciando ProdutoController@store ---');
        Log::info('Dados recebidos para novo produto:', $request->all());
        Log::info('Arquivos recebidos:', $request->allFiles());
        Log::info('Ocasioes recebidas:', $request->input('ocasioes'));
        Log::info('Estilos recebidos:', $request->input('estilos'));

        $estadosConservacao = ['novo', 'seminovo', 'usado', 'com defeito', 'restaurado'];
        $estacoes = ['verao', 'outono', 'inverno', 'primavera', 'todas', 'neutra'];
        $generos = ['masculino', 'feminino', 'unissex'];
        $categorias = [
            'chapeu', 'tiara', 'bone', 'lenco',
            'camiseta', 'camisa', 'blusa', 'jaqueta', 'casaco', 'sueter', 'regata', 'colete',
            'calca', 'saia', 'short', 'legging', 'bermuda', 'jardineira',
            'tenis', 'sandalia', 'bota', 'sapato', 'chinelo',
            'cinto', 'oculos', 'bolsa', 'relogio', 'brinco', 'colar', 'pulseira', 'anel',
            'outro_acessorios_cabeca', 'outro_tops', 'outro_calcas_saias', 'outro_calcados', 'outro_acessorios'
        ];
        $ocasioes = ['trabalho', 'festa', 'casual', 'esporte', 'praia', 'balada', 'dia a dia', 'casamento', 'formatura', 'viagem'];
        $estilos = ['classico', 'moderno', 'boho', 'minimalista', 'rocker', 'romantico', 'esportivo', 'urbano', 'vintage'];
        $materiais = ['algodao', 'linho', 'la', 'seda', 'jeans', 'couro', 'moletom', 'viscose', 'poliester'];

        $validatedData = $request->validate([
            'nome_produto' => 'required|string|max:55',
            'preco' => 'required|numeric|min:0',
            'marca' => 'nullable|string|max:55',
            'estado_conservacao' => 'nullable|string|in:' . implode(',', $estadosConservacao),
            'estacao' => 'nullable|string|in:' . implode(',', $estacoes),
            'categoria' => 'nullable|string|in:' . implode(',', $categorias),
            'genero' => 'nullable|string|in:' . implode(',', $generos),
            'cor' => 'nullable|string|max:55',
            'numeracao' => 'nullable|string|max:20',
            'imagem_principal' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'imagens_adicionais.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'ocasioes' => 'nullable',
            'estilos' => 'nullable',
            'material' => 'nullable|string',
        ]);

        // Processar arrays manualmente
        $ocasioes = $request->input('ocasioes');
        $estilos = $request->input('estilos');
        
        // Se ocasioes vier como string (JSON), converter para array
        if (is_string($ocasioes)) {
            $ocasioesArray = json_decode($ocasioes, true);
            $validatedData['ocasioes'] = is_array($ocasioesArray) ? $ocasioesArray : [];
        } else {
            $validatedData['ocasioes'] = is_array($ocasioes) ? $ocasioes : [];
        }
        
        // Se estilos vier como string (JSON), converter para array
        if (is_string($estilos)) {
            $estilosArray = json_decode($estilos, true);
            $validatedData['estilos'] = is_array($estilosArray) ? $estilosArray : [];
        } else {
            $validatedData['estilos'] = is_array($estilos) ? $estilos : [];
        }

        Log::info('Ocasioes processadas:', $validatedData['ocasioes']);
        Log::info('Estilos processados:', $validatedData['estilos']);

        try {
            $produto = Produto::create([
                'nome_produto' => $validatedData['nome_produto'],
                'preco' => $validatedData['preco'],
                'marca' => $validatedData['marca'] ?? null,
                'estado_conservacao' => $validatedData['estado_conservacao'] ?? null,
                'estacao' => $validatedData['estacao'] ?? null,
                'categoria' => $validatedData['categoria'] ?? null,
                'genero' => $validatedData['genero'] ?? null,
                'cor' => $validatedData['cor'] ?? null,
                'numeracao' => $validatedData['numeracao'] ?? null,
                'ocasioes' => $validatedData['ocasioes'] ?? null,
                'estilos' => $validatedData['estilos'] ?? null,
                'material' => $validatedData['material'] ?? null,
            ]);
            Log::info('Produto criado com ID: ' . $produto->id);

            if ($request->hasFile('imagem_principal') && $request->file('imagem_principal')->isValid()) {
                Log::info('Arquivo imagem_principal recebido.');
                $path = $request->file('imagem_principal')->store('produtos', 'public');
                Log::info('Imagem principal salva em: ' . $path);

                $imagem = new Imagem([
                    'url' => $path,
                    'is_principal' => true
                ]);
                $produto->imagens()->save($imagem);
                Log::info('Registro da Imagem principal criado e associado ao produto ID: ' . $produto->id);
            }

            if ($request->hasFile('imagens_adicionais')) {
                Log::info('Arquivos de imagens_adicionais recebidos.');
                foreach ($request->file('imagens_adicionais') as $file) {
                    if ($file->isValid()) {
                        $path = $file->store('produtos', 'public');
                        $imagemAdicional = new Imagem([
                            'url' => $path,
                            'is_principal' => false
                        ]);
                        $produto->imagens()->save($imagemAdicional);
                        Log::info('Imagem adicional salva em: ' . $path . ' para o produto ID: ' . $produto->id);
                    }
                }
            }

            $produto->load('imagens');
            $user = Auth::guard('sanctum')->user();
            $this->addFavoritedStatusToProducts($produto, $user);


            return response()->json([
                'success' => true,
                'message' => 'Produto cadastrado com sucesso!',
                'data' => $produto
            ], 201);

        } catch (\Exception $e) {
            Log::error('Erro ao salvar produto ou imagem: ' . $e->getMessage(), [
                'arquivo' => $e->getFile(),
                'linha' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Erro interno do servidor ao cadastrar o produto.'
            ], 500);
        }
    }

    public function show(string $id)
    {
        try {
            $produto = Produto::with('imagens')->findOrFail($id);

            $user = Auth::guard('sanctum')->user();
            $this->addFavoritedStatusToProducts($produto, $user);

            return response()->json([
                'success' => true,
                'data' => $produto
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['success' => false, 'message' => 'Produto não encontrado.'], 404);
        } catch (\Exception $e) {
            Log::error('Erro em ProdutoController@show para ID ' . $id . ': ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Erro ao buscar detalhes do produto.'], 500);
        }
    }

    public function search(Request $request)
    {
        try {
            $request->validate([
                'term' => ['required', 'string', 'max:255'],
            ]);
            
            $term = $request->term;
            $perPage = $request->get('per_page', 8);
            $query = Produto::query();
            
            // Busca por termo
            $query->where(function($q) use ($term) {
                $q->where('nome_produto', 'LIKE', "%{$term}%")
                  ->orWhere('marca', 'LIKE', "%{$term}%")
                  ->orWhere('categoria', 'LIKE', "%{$term}%")
                  ->orWhere('cor', 'LIKE', "%{$term}%");
            });
            
            // Aplicar filtros se fornecidos
            $filters = $request->except(['term', 'page', 'per_page']);
            foreach ($filters as $key => $values) {
                if (is_array($values) && !empty($values)) {
                    $query->whereIn($key, $values);
                } elseif (!empty($values)) {
                    $query->where($key, $values);
                }
            }
            
            $produtos = $query->with('imagens')->latest()->paginate($perPage);

            $user = Auth::guard('sanctum')->user();
            $this->addFavoritedStatusToProducts($produtos, $user);

            return response()->json([
                'success' => true,
                'data' => $produtos
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['success' => false, 'message' => 'Termo de busca inválido.', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Erro em ProdutoController@search para termo ' . $request->term . ': ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Erro ao buscar produtos.'], 500);
        }
    }

    public function uploadImagem(Request $request, $produtoId)
    {
        try {
            $request->validate([
                'imagem' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
                'is_principal' => 'sometimes|boolean'
            ]);
            $produto = Produto::findOrFail($produtoId);
            $path = $request->file('imagem')->store('produtos', 'public');

            $isPrincipal = $request->input('is_principal', false);

            if ($isPrincipal) {
                $produto->imagens()->where('is_principal', true)->update(['is_principal' => false]);
            }

            $imagem = new Imagem([
                'url' => $path,
                'is_principal' => $isPrincipal
            ]);
            $produto->imagens()->save($imagem);

            return response()->json([
                'success' => true,
                'message' => 'Imagem do produto enviada com sucesso!',
                'data' => [
                    'id' => $imagem->id,
                    'url' => asset('storage/' . $path),
                    'is_principal' => $imagem->is_principal
                ]
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['success' => false, 'message' => 'Dados de imagem inválidos.', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Erro em ProdutoController@uploadImagem para produto ID ' . $produtoId . ': ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Erro ao enviar imagem do produto.'], 500);
        }
    }
}
