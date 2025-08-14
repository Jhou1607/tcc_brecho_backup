<?php

namespace App\Http\Controllers;

use App\Models\Usuario; // Já estava importado
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule; // ADICIONADO para validação de email único

class UsuarioController extends Controller
{
    // Seu método uploadFoto() existente (mantido intacto):
    public function uploadFoto(Request $request)
    {
        Log::info('--- Iniciando uploadFoto ---');
        try {
            Log::info('Validando request...');
            $request->validate([
                'foto' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            ]);
            Log::info('Validação bem-sucedida.');

            $usuario = $request->user();
            if (!$usuario) {
                Log::error('Usuário não autenticado ao tentar fazer upload.');
                return response()->json(['message' => 'Usuário não autenticado'], 401);
            }
            Log::info('Usuário autenticado: ID ' . $usuario->id);

            $file = $request->file('foto');
            $originalName = $file->getClientOriginalName();
            $extension = $file->getClientOriginalExtension();
            $safeExtension = $file->guessExtension() ?: $extension;

            if (!in_array($safeExtension, ['jpeg', 'png', 'jpg', 'gif', 'webp'])) {
                $nomeArquivo = Str::uuid() . '.' . ($safeExtension ?: 'jpg');
            } else {
                $nomeArquivo = Str::uuid() . '.' . $safeExtension;
            }

            $caminho = 'fotos/perfil';
            Log::info("Arquivo original: {$originalName}, Novo nome para salvar: {$nomeArquivo}, Caminho de destino: {$caminho}");

            if ($usuario->foto_url) {
                Log::info("Tentando deletar foto antiga: {$usuario->foto_url}");
                try {
                    $deleteResult = Storage::disk('public')->delete($usuario->foto_url);
                    Log::info($deleteResult ? 'Foto antiga deletada com sucesso.' : 'Foto antiga não encontrada ou falha ao deletar.');
                } catch (\Exception $e) {
                    Log::error("Erro ao deletar foto antiga {$usuario->foto_url}: " . $e->getMessage());
                }
            } else {
                Log::info('Nenhuma foto antiga para deletar.');
            }

            Log::info("Tentando armazenar novo arquivo: {$nomeArquivo} (original: {$originalName})");
            $caminhoCompleto = $file->storeAs($caminho, $nomeArquivo, 'public');
            Log::info("Arquivo armazenado com sucesso. Caminho completo no disco: {$caminhoCompleto}");

            Log::info("Atualizando foto_url do usuário no banco para: {$caminhoCompleto}");
            $usuario->update([
                'foto_url' => $caminhoCompleto,
            ]);
            Log::info('Banco de dados atualizado com foto_url.'); // Log ajustado

            $publicUrl = asset('storage/' . $caminhoCompleto);
            Log::info("URL pública da nova foto (usando asset()): {$publicUrl}");
            Log::info('--- uploadFoto finalizado com sucesso ---');

            return response()->json([
                'message' => 'Foto de perfil atualizada com sucesso!',
                'foto_url' => $publicUrl,
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Erro de validação no uploadFoto: ', $e->errors());
            Log::info('--- uploadFoto finalizado com erro de validação ---');
            return response()->json(['message' => 'Erro de validação', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Exceção geral no uploadFoto: ' . $e->getMessage(), [
                'arquivo_log' => $e->getFile(),
                'linha_log' => $e->getLine(),
                'trace_log' => $e->getTraceAsString()
            ]);
            Log::info('--- uploadFoto finalizado com exceção geral ---');
            return response()->json(['message' => 'Erro interno do servidor ao processar a foto.'], 500);
        }
    }

    // NOVO MÉTODO ADICIONADO ABAIXO:
    /**
     * Atualiza os dados do perfil do usuário autenticado.
     */
    public function updateProfile(Request $request)
    {
        Log::info('--- Iniciando updateProfile ---');
        Log::info('Dados recebidos para atualização do perfil:', $request->all());

        $usuario = $request->user();

        if (!$usuario) {
            Log::error('Usuário não autenticado ao tentar atualizar perfil.');
            return response()->json(['message' => 'Usuário não autenticado.'], 401);
        }
        Log::info('Usuário autenticado para updateProfile: ID ' . $usuario->id);

        // Validação dos dados que podem ser atualizados
        // 'sometimes' significa que o campo só será validado se estiver presente na requisição.
        $validatedData = $request->validate([
            'nome_usuario' => 'sometimes|string|max:55',
            'email' => [
                'sometimes',
                'string',
                'email',
                'max:55',
                Rule::unique('usuarios')->ignore($usuario->id), // Permite o email atual do usuário ou um novo que seja único
            ],
            'data_nascimento' => 'sometimes|nullable|date_format:Y-m-d', // Garante formato de data
            'sexo' => ['sometimes', 'nullable', Rule::in(['masculino', 'feminino', ''])], // Permite string vazia se o select enviar
            'bio' => 'sometimes|nullable|string|max:500', // Ajuste o max se necessário
        ]);

        Log::info('Dados validados para updateProfile:', $validatedData);

        // Tratar campos opcionais que podem vir como string vazia do frontend
        // e que você pode querer salvar como NULL no banco.
        if (array_key_exists('sexo', $validatedData) && $validatedData['sexo'] === '') {
            $validatedData['sexo'] = null;
        }
        if (array_key_exists('data_nascimento', $validatedData) && $validatedData['data_nascimento'] === '') {
            $validatedData['data_nascimento'] = null;
        }
        // Para a bio, se o frontend enviar string vazia e você quiser null no banco:
        // if (array_key_exists('bio', $validatedData) && $validatedData['bio'] === '') {
        //    $validatedData['bio'] = null;
        // }

        // Atualiza apenas os campos que foram validados e estão no $fillable do modelo
        $usuario->fill($validatedData);

        if ($usuario->isDirty()) { // Verifica se houve alguma alteração real
            $usuario->save();
            Log::info('Perfil do usuário ID ' . $usuario->id . ' atualizado no banco.');
            // É uma boa prática retornar o usuário atualizado ou uma mensagem de sucesso.
            // O frontend provavelmente fará um fetchCurrentUser() para atualizar os dados.
            return response()->json([
                'message' => 'Perfil atualizado com sucesso!',
                // Opcional: retornar o usuário atualizado. O método 'me' já faz isso com o formato correto.
                // 'user' => $usuario->fresh()->makeHidden('password', 'remember_token') // Exemplo
            ], 200);
        } else {
            Log::info('Nenhuma alteração detectada para o usuário ID ' . $usuario->id);
            return response()->json(['message' => 'Nenhuma alteração para salvar.'], 200);
        }
    }
}
