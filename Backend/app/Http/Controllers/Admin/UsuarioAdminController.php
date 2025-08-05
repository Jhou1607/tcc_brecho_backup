<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UsuarioAdminController extends Controller
{
    public function index(Request $request)
    {
        try {
            $perPage = $request->get('per_page', 10);
            $usuarios = Usuario::latest()->paginate($perPage);

            return response()->json($usuarios);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao carregar usuários',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $usuario = Usuario::findOrFail($id);

            // Verificar se não é o próprio usuário logado
            if ($usuario->id === auth()->id()) {
                return response()->json([
                    'error' => 'Não é possível deletar sua própria conta'
                ], 422);
            }

            $usuario->delete();

            return response()->json([
                'success' => true,
                'message' => 'Usuário deletado com sucesso'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao deletar usuário',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function updateRole(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'role' => 'required|in:user,admin'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'error' => 'Role inválida',
                    'errors' => $validator->errors()
                ], 422);
            }

            $usuario = Usuario::findOrFail($id);

            // Verificar se não está alterando sua própria role
            if ($usuario->id === auth()->id()) {
                return response()->json([
                    'error' => 'Não é possível alterar sua própria role'
                ], 422);
            }

            $usuario->update(['role' => $request->role]);

            return response()->json($usuario);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao atualizar role do usuário',
                'message' => $e->getMessage()
            ], 500);
        }
    }
} 