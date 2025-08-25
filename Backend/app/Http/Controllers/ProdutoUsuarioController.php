<?php

namespace App\Http\Controllers;

use App\Models\Imagem;
use App\Models\ProdutoUsuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class ProdutoUsuarioController extends Controller
{
    public function index(Request $request)
    {
        try {
            $usuario = Auth::user();
            $perPage = $request->get('per_page', 8);
            $produtos = $usuario->produtosProprios()
                ->with('imagens')
                ->latest()
                ->paginate($perPage);

            return response()->json(['success' => true, 'data' => $produtos]);
        } catch (\Exception $e) {
            Log::error('Erro ao buscar peças do usuário: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Erro ao buscar peças do armário.'], 500);
        }
    }

    public function show(ProdutoUsuario $produtoUsuario)
    {
        try {
            if (Auth::id() !== $produtoUsuario->usuario_id) {
                return response()->json(['success' => false, 'message' => 'Não autorizado.'], 403);
            }

            $produtoUsuario->load('imagens');

            return response()->json(['success' => true, 'data' => $produtoUsuario]);
        } catch (\Exception $e) {
            Log::error('Erro ao buscar detalhe da peça do usuário: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Erro ao buscar detalhes da peça.'], 500);
        }
    }

    public function store(Request $request)
    {
        // Buscar filtros administráveis ativos
        $adminFilterOptions = \App\Models\AdminFilterOption::active()->get()->groupBy('filter_type');
        
        $estacoes = $adminFilterOptions->get('estacao', collect())->pluck('value')->toArray();
        $categorias = $adminFilterOptions->get('categoria', collect())->pluck('value')->toArray();
        $ocasioes = $adminFilterOptions->get('ocasioes', collect())->pluck('value')->toArray();
        $estilos = $adminFilterOptions->get('estilos', collect())->pluck('value')->toArray();
        $materiais = $adminFilterOptions->get('material', collect())->pluck('value')->toArray();
        $cores = $adminFilterOptions->get('cor', collect())->pluck('value')->toArray();

        $validator = Validator::make($request->all(), [
            'nome_produto' => 'required|string|max:55',
            'marca' => 'nullable|string|max:55',
            'estacao' => 'nullable|string|in:' . implode(',', $estacoes),
            'categoria' => 'nullable|string|in:' . implode(',', $categorias),
            'cor' => 'nullable|string|in:' . implode(',', $cores),
            'imagem_principal' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'ocasioes' => 'nullable|array',
            'ocasioes.*' => 'string|in:' . implode(',', $ocasioes),
            'estilos' => 'nullable|array',
            'estilos.*' => 'string|in:' . implode(',', $estilos),
            'material' => 'nullable|string|in:' . implode(',', $materiais),
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Dados inválidos.',
                'errors' => $validator->errors()
            ], 422);
        }

        $validatedData = $validator->validated();
        $usuario = Auth::user();

        try {
            $produtoUsuario = $usuario->produtosProprios()->create([
                'nome_produto' => $validatedData['nome_produto'],
                'marca' => $validatedData['marca'] ?? null,
                'estacao' => $validatedData['estacao'] ?? null,
                'categoria' => $validatedData['categoria'] ?? null,
                'cor' => $validatedData['cor'] ?? null,
                'ocasioes' => $validatedData['ocasioes'] ?? null,
                'estilos' => $validatedData['estilos'] ?? null,
                'material' => $validatedData['material'] ?? null,
            ]);

            if ($request->hasFile('imagem_principal')) {
                $path = $request->file('imagem_principal')->store('produtos_usuarios', 'public');
                $imagem = new Imagem(['url' => $path, 'is_principal' => true]);
                $produtoUsuario->imagens()->save($imagem);
            }

            $produtoUsuario->load('imagens');

            return response()->json([
                'success' => true,
                'message' => 'Peça cadastrada com sucesso no seu armário!',
                'data' => $produtoUsuario
            ], 201);

        } catch (\Exception $e) {
            Log::error('Erro ao salvar peça do usuário: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Erro interno do servidor.'], 500);
        }
    }

    public function destroy(ProdutoUsuario $produtoUsuario)
    {
        try {
            if (Auth::id() !== $produtoUsuario->usuario_id) {
                return response()->json(['success' => false, 'message' => 'Não autorizado.'], 403);
            }

            foreach ($produtoUsuario->imagens as $imagem) {
                Storage::disk('public')->delete($imagem->url);
                $imagem->delete();
            }

            $produtoUsuario->delete();

            return response()->json(['success' => true, 'message' => 'Peça removida com sucesso.']);

        } catch (\Exception $e) {
            Log::error('Erro ao excluir peça do usuário: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Erro ao excluir a peça.'], 500);
        }
    }
}
