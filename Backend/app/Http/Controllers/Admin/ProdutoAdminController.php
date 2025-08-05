<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Produto;
use App\Models\Imagem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ProdutoAdminController extends Controller
{
    public function index(Request $request)
    {
        try {
            $perPage = $request->get('per_page', 10);
            $produtos = Produto::with('imagens')
                ->latest()
                ->paginate($perPage);

            return response()->json($produtos);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao carregar produtos',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'nome_produto' => 'required|string|max:255',
                'preco' => 'required|numeric|min:0',
                'marca' => 'nullable|string|max:255',
                'modelo' => 'nullable|string|max:255',
                'estado_conservacao' => 'nullable|string',
                'estacao' => 'nullable|string',
                'categoria' => 'nullable|string',
                'genero' => 'nullable|string',
                'cor' => 'nullable|string',
                'numeracao' => 'nullable|string',
                'material' => 'nullable|string',
                'ocasioes' => 'nullable|array',
                'estilos' => 'nullable|array',
                'imagens.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'error' => 'Dados inválidos',
                    'errors' => $validator->errors()
                ], 422);
            }

            $produto = Produto::create($request->except(['imagens']));

            // Upload de imagens
            if ($request->hasFile('imagens')) {
                foreach ($request->file('imagens') as $index => $image) {
                    $path = $image->store('produtos', 'public');
                    
                    Imagem::create([
                        'url' => $path,
                        'imageable_type' => Produto::class,
                        'imageable_id' => $produto->id,
                        'is_principal' => $index === 0 // Primeira imagem é principal
                    ]);
                }
            }

            $produto->load('imagens');

            return response()->json($produto, 201);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao criar produto',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $produto = Produto::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'nome_produto' => 'required|string|max:255',
                'preco' => 'required|numeric|min:0',
                'marca' => 'nullable|string|max:255',
                'modelo' => 'nullable|string|max:255',
                'estado_conservacao' => 'nullable|string',
                'estacao' => 'nullable|string',
                'categoria' => 'nullable|string',
                'genero' => 'nullable|string',
                'cor' => 'nullable|string',
                'numeracao' => 'nullable|string',
                'material' => 'nullable|string',
                'ocasioes' => 'nullable|array',
                'estilos' => 'nullable|array',
                'imagens.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'error' => 'Dados inválidos',
                    'errors' => $validator->errors()
                ], 422);
            }

            $produto->update($request->except(['imagens']));

            // Upload de novas imagens
            if ($request->hasFile('imagens')) {
                foreach ($request->file('imagens') as $index => $image) {
                    $path = $image->store('produtos', 'public');
                    
                    Imagem::create([
                        'url' => $path,
                        'imageable_type' => Produto::class,
                        'imageable_id' => $produto->id,
                        'is_principal' => false
                    ]);
                }
            }

            $produto->load('imagens');

            return response()->json($produto);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao atualizar produto',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $produto = Produto::findOrFail($id);

            // Deletar imagens associadas
            foreach ($produto->imagens as $imagem) {
                if (Storage::disk('public')->exists($imagem->url)) {
                    Storage::disk('public')->delete($imagem->url);
                }
                $imagem->delete();
            }

            $produto->delete();

            return response()->json([
                'success' => true,
                'message' => 'Produto deletado com sucesso'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao deletar produto',
                'message' => $e->getMessage()
            ], 500);
        }
    }
} 