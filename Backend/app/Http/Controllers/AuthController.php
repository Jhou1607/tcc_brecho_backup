<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http; // Para requisições HTTP
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use App\Mail\ResetPasswordMail;

class AuthController extends Controller
{
    /**
     * Register a new user.
     */
    public function register(Request $request): \Illuminate\Http\JsonResponse
    {
        // Depuração: Logar os dados recebidos
        \Log::info('Dados recebidos no register:', $request->all());

        $validated = $request->validate([
            'nome_usuario' => 'required|string|max:55',
            'email' => 'required|string|email|max:55|unique:usuarios',
            'password' => 'required|string|min:6|confirmed', // Adicionada validação confirmed
            'data_nascimento' => 'required|date',
            'sexo' => 'required|string|in:masculino,feminino',
        ]);

        $user = \App\Models\Usuario::create([
            'nome_usuario' => $validated['nome_usuario'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'data_nascimento' => $validated['data_nascimento'],
            'sexo' => $validated['sexo'],
        ]);

        return response()->json(['message' => 'Usuário registrado com sucesso', 'user' => $user], 201);
    }

    /**
     * Log in a user and create a Sanctum token.
     */
    public function login(Request $request)
    {
        try {
            $request->validate([
                'email' => ['required', 'string', 'email'],
                'password' => ['required', 'string'],
            ], [
                'email.required' => 'O campo email é obrigatório.',
                'email.email' => 'Por favor, insira um email válido.',
                'password.required' => 'O campo senha é obrigatório.',
            ]);

            $credentials = [
                'email' => $request->email,
                'password' => $request->password,
            ];

            if (!Auth::attempt($credentials)) {
                return response()->json([
                    'message' => 'Credenciais inválidas.'
                ], 401);
            }

            $usuario = Auth::user();
            $token = $usuario->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Login bem-sucedido.',
                'access_token' => $token,
                'token_type' => 'Bearer',
            ], 200);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Erro de validação',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Ocorreu um erro ao tentar fazer login.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Log out the authenticated user (revoke token).
     */
    public function logout(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'message' => 'Logout bem-sucedido.'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Ocorreu um erro ao tentar fazer logout.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Login/Cadastro com Google
     */
    public function loginWithGoogle(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
        ]);

        $googleToken = $request->input('token');

        // Validar o token com o Google
        $googleResponse = Http::get('https://oauth2.googleapis.com/tokeninfo', [
            'id_token' => $googleToken
        ]);

        if (!$googleResponse->ok()) {
            return response()->json(['message' => 'Token do Google inválido.'], 401);
        }

        $googleData = $googleResponse->json();
        $email = $googleData['email'] ?? null;
        $nome = $googleData['name'] ?? ($googleData['given_name'] ?? 'Usuário Google');
        $foto = $googleData['picture'] ?? null;

        if (!$email) {
            return response()->json(['message' => 'Não foi possível obter o e-mail do Google.'], 422);
        }

        // Buscar ou criar usuário
        $usuario = \App\Models\Usuario::where('email', $email)->first();
        if (!$usuario) {
            $usuario = \App\Models\Usuario::create([
                'nome_usuario' => $nome,
                'email' => $email,
                'password' => bcrypt(uniqid('google_', true)), // senha aleatória
                'data_nascimento' => now()->subYears(18)->format('Y-m-d'), // default: maior de idade
                'sexo' => 'masculino', // default, pode ser ajustado depois
                'foto_url' => $foto,
            ]);
        } else {
            // Atualiza foto se mudou
            if ($foto && $usuario->foto_url !== $foto) {
                $usuario->foto_url = $foto;
                $usuario->save();
            }
        }

        // Autenticar e gerar token
        $token = $usuario->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login com Google bem-sucedido.',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $usuario,
        ]);
    }

    /**
     * Retornar dados do usuário autenticado.
     */
    public function me(Request $request)
    {
        try {
            $usuario = $request->user();
            if (!$usuario) {
                return response()->json(['message' => 'Usuário não autenticado'], 401);
            }

            $fotoUrlParaRetorno = null;
            // $usuario->foto_url vindo do banco é o caminho relativo, ex: 'fotos/perfil/imagem.jpg'
            if (isset($usuario->foto_url) && $usuario->foto_url) {
                // Use asset() para construir a URL completa
                $fotoUrlParaRetorno = asset('storage/' . $usuario->foto_url);
            }

            // Retornar os dados esperados pelo frontend
            return response()->json([
                'id' => $usuario->id,
                'nome_usuario' => $usuario->nome_usuario,
                'email' => $usuario->email,
                'sexo' => $usuario->sexo,
                'data_nascimento' => $usuario->data_nascimento,
                'foto_url' => $fotoUrlParaRetorno, // URL completa ou null
                'bio' => $usuario->bio ?? null,
                'role' => $usuario->role ?? 'user', // Adicionando o campo role
                'created_at' => $usuario->created_at,
                'updated_at' => $usuario->updated_at,
            ], 200);
        } catch (\Exception $e) {
            Log::error('Erro no método me:', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json([
                'message' => 'Erro ao carregar dados do usuário',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Enviar email de recuperação de senha
     */
    public function forgotPassword(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email|exists:usuarios,email',
            ], [
                'email.required' => 'O campo email é obrigatório.',
                'email.email' => 'Por favor, insira um email válido.',
                'email.exists' => 'Este email não está cadastrado em nossa base de dados.',
            ]);

            $email = $request->email;
            $usuario = Usuario::where('email', $email)->first();

            if (!$usuario) {
                return response()->json([
                    'message' => 'Email não encontrado em nossa base de dados.'
                ], 404);
            }

            // Gerar token único para reset de senha
            $token = Str::random(64);
            
            // Salvar token no banco (você pode criar uma tabela password_resets se necessário)
            // Por enquanto, vamos simular o envio do email
            
            // Enviar email de recuperação
            try {
                Mail::to($email)->send(new ResetPasswordMail($token, $email));
                
                return response()->json([
                    'message' => 'Email de recuperação enviado com sucesso!',
                    'email' => $email
                ], 200);
            } catch (\Exception $e) {
                return response()->json([
                    'message' => 'Erro ao enviar email. Verifique as configurações de SMTP.',
                    'error' => $e->getMessage()
                ], 500);
            }

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Erro de validação',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Ocorreu um erro ao enviar o email de recuperação.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Redefinir senha com token
     */
    public function resetPassword(Request $request)
    {
        try {
            $request->validate([
                'token' => 'required|string',
                'email' => 'required|email|exists:usuarios,email',
                'password' => 'required|string|min:6|confirmed',
            ], [
                'token.required' => 'Token é obrigatório.',
                'email.required' => 'Email é obrigatório.',
                'email.email' => 'Email inválido.',
                'email.exists' => 'Email não encontrado.',
                'password.required' => 'Senha é obrigatória.',
                'password.min' => 'A senha deve ter pelo menos 6 caracteres.',
                'password.confirmed' => 'As senhas não coincidem.',
            ]);

            $email = $request->email;
            $token = $request->token;
            $password = $request->password;

            // Buscar usuário
            $usuario = Usuario::where('email', $email)->first();

            if (!$usuario) {
                return response()->json([
                    'message' => 'Email não encontrado.'
                ], 404);
            }

            // Aqui você pode implementar a validação do token
            // Por enquanto, vamos simular que o token é válido
            // Em produção, você deve verificar se o token existe e não expirou

            // Atualizar a senha
            $usuario->password = bcrypt($password);
            $usuario->save();

            return response()->json([
                'message' => 'Senha redefinida com sucesso!'
            ], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Erro de validação',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Ocorreu um erro ao redefinir a senha.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
