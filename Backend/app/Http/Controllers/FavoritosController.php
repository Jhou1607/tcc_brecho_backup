<?php

namespace App\Http\Controllers;

use App\Models\Produto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class FavoritosController extends Controller
{
    public function toggle(Request $request)
    {
        $request->validate([
            'produto_id' => 'required|integer|exists:produtos,id',
        ]);

        $usuario = Auth::user();
        $produtoId = $request->produto_id;

        try {
            $favorito = $usuario->favoritos()->where('produto_id', $produtoId)->first();

            if ($favorito) {
                $usuario->favoritos()->detach($produtoId);
                return response()->json(['success' => true, 'message' => 'Produto removido dos favoritos.', 'status' => 'removed']);
            } else {
                $usuario->favoritos()->attach($produtoId);
                return response()->json(['success' => true, 'message' => 'Produto adicionado aos favoritos.', 'status' => 'added']);
            }
        } catch (\Exception $e) {
            Log::error('Erro ao alternar favorito: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Erro ao processar a solicitação.'], 500);
        }
    }

    public function index()
    {
        try {
            $usuario = Auth::user();

            $favoritos = $usuario->favoritos()->with('imagens')->latest()->paginate(8);

            $favoritos->getCollection()->transform(function ($produto) {
                $produto->is_favorited = true;
                return $produto;
            });

            return response()->json(['success' => true, 'data' => $favoritos]);
        } catch (\Exception $e) {
            Log::error('Erro ao buscar favoritos: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Erro ao buscar a lista de desejos.'], 500);
        }
    }

    public function getFavoritosIds()
    {
        try {
            $usuario = Auth::user();
            $favoritosIds = $usuario->favoritos()->pluck('produtos.id')->toArray();
            return response()->json(['success' => true, 'data' => $favoritosIds]);
        } catch (\Exception $e) {
            Log::error('Erro ao buscar IDs de favoritos: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Erro ao buscar IDs de favoritos.'], 500);
        }
    }
}
