<?php

namespace App\Http\Controllers;

use App\Models\Look;
use App\Models\Usuario; // <<-- Adicione este import, caso precise para tipagem Auth::user()
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class LookController extends Controller
{
    public function index()
    {
        try {
            /** @var \App\Models\Usuario $user */ // <<-- Adicione para tipagem mais clara (opcional, mas bom)
            $user = Auth::user();
            if (!$user) {
                Log::warning('Tentativa de acessar looks sem autenticação.');
                return response()->json(['message' => 'Não autenticado.'], 401);
            }
            $looks = $user->looks()->latest()->get(); // Chama o relacionamento 'looks()' do modelo Usuario
            return response()->json(['success' => true, 'data' => $looks]);
        } catch (\Exception $e) {
            Log::error('Erro ao carregar looks: ' . $e->getMessage(), ['exception' => $e]);
            return response()->json(['message' => 'Ocorreu um erro ao carregar os looks.'], 500);
        }
    }

    public function show($id)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                Log::warning("Tentativa de acessar look ID {$id} sem autenticação.");
                return response()->json(['message' => 'Não autenticado.'], 401);
            }
            $look = $user->looks()->findOrFail($id);
            // Retorna apenas os campos relevantes, garantindo o nome 'configuracao'
            return response()->json([
                'id' => $look->id,
                'nome_look' => $look->nome_look,
                'configuracao' => $look->configuracao,
                'imagem_url' => $look->imagem_url,
                'created_at' => $look->created_at,
                'updated_at' => $look->updated_at,
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::warning("Look ID {$id} não encontrado ou não pertence ao usuário autenticado.");
            return response()->json(['message' => 'Look não encontrado.'], 404);
        } catch (\Exception $e) {
            Log::error('Erro ao exibir look: ' . $e->getMessage(), ['exception' => $e]);
            return response()->json(['message' => 'Ocorreu um erro ao exibir o look.'], 500);
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nome_look' => 'nullable|string|max:255',
            'configuracao' => 'required|array',
            'imagem_base64' => 'required|string'
        ]);

        // Salvar imagem
        $image = $request->input('imagem_base64');
        $image = str_replace('data:image/png;base64,', '', $image);
        $image = str_replace(' ', '+', $image);
        $imageName = 'look_' . uniqid() . '.png';
        \Storage::disk('public')->put('looks/' . $imageName, base64_decode($image));
        $imagem_url = 'storage/looks/' . $imageName;

        $look = Look::create([
            'usuario_id' => Auth::id(),
            'nome_look' => $validated['nome_look'],
            'configuracao' => $validated['configuracao'],
            'imagem_url' => $imagem_url
        ]);

        return response()->json(['success' => true, 'message' => 'Look salvo com sucesso!', 'data' => $look], 201);
    }

    public function update(Request $request, $id)
    {
        $user = Auth::user();
        $look = $user->looks()->findOrFail($id);
        $validated = $request->validate([
            'nome_look' => 'nullable|string|max:255',
            'configuracao' => 'required|array',
            'imagem_base64' => 'nullable|string'
        ]);
        if (isset($validated['imagem_base64'])) {
            $image = $validated['imagem_base64'];
            $image = str_replace('data:image/png;base64,', '', $image);
            $image = str_replace(' ', '+', $image);
            $imageName = 'look_' . uniqid() . '.png';
            \Storage::disk('public')->put('looks/' . $imageName, base64_decode($image));
            $look->imagem_url = 'storage/looks/' . $imageName;
        }
        $look->nome_look = $validated['nome_look'];
        $look->configuracao = $validated['configuracao'];
        $look->save();
        return response()->json(['success' => true, 'message' => 'Look atualizado com sucesso!', 'data' => $look]);
    }

    public function destroy($id)
    {
        $user = Auth::user();
        $look = $user->looks()->findOrFail($id);
        $look->delete();
        return response()->json(['success' => true, 'message' => 'Look removido com sucesso!']);
    }
}