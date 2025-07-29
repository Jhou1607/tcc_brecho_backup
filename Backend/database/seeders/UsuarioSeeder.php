<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\Usuario;
use Carbon\Carbon;

class UsuarioSeeder extends Seeder
{

    public function run(): void

    {

        Usuario::query()->delete();

        $usuariosParaCriar = [
            [
                'nome_usuario' => 'Bruno Vendramini de Souza',
                'email' => 'bruno.vendramini@unesp.br',
                'password' => Hash::make('123456'),
                'email_verified_at' => Carbon::now(),
                'role' => 'admin',
            ],
            [
                'nome_usuario' => 'Camila Midori Sakai',
                'email' => 'camila.midori-sakai@unesp.br',
                'password' => Hash::make('123456'),
                'email_verified_at' => Carbon::now(),
                'role' => 'admin',
            ],
            [
                'nome_usuario' => 'Gabriela Oliveira Fernandes',
                'email' => 'gabriela.o.fernandes@unesp.br',
                'password' => Hash::make('123456'),
                'email_verified_at' => Carbon::now(),
                'role' => 'admin',
            ],
            [
                'nome_usuario' => 'Jonathas Carvalho Chiavelli',
                'email' => 'jc.chiavelli@unesp.br',
                'password' => Hash::make('123456'),
                'email_verified_at' => Carbon::now(),
                'role' => 'admin',
            ],
            [
                'nome_usuario' => 'Julia Gomes Serra',
                'email' => 'julia.g.serra@unesp.br',
                'password' => Hash::make('123456'),
                'email_verified_at' => Carbon::now(),
                'role' => 'admin',
            ],
            [
                'nome_usuario' => 'Luana Thomé Bortotto',
                'email' => 'luana.t.bortotto@unesp.br',
                'password' => Hash::make('123456'),
                'email_verified_at' => Carbon::now(),
                'role' => 'admin',
            ],
            [
                'nome_usuario' => 'Maria Eduarda Ferreira de Oliveira',
                'email' => 'maria.ef.oliveira@unesp.br',
                'password' => Hash::make('123456'),
                'email_verified_at' => Carbon::now(),
                'role' => 'admin',
            ],
        ];

        foreach ($usuariosParaCriar as $userData) {
            Usuario::create($userData);
        }
    }
}
