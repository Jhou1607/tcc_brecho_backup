<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Garante que o tipo não existe antes de criar
        DB::statement('DROP TYPE IF EXISTS categoria_enum CASCADE;');

        // Criar o ENUM categoria_enum com todos os valores possíveis
        $categorias = [
            'chapeu', 'tiara', 'bone', 'lenco',
            'camiseta', 'camisa', 'blusa', 'jaqueta', 'casaco', 'sueter', 'regata', 'colete',
            'calca', 'saia', 'short', 'legging', 'bermuda', 'jardineira',
            'tenis', 'sandalia', 'bota', 'sapato', 'chinelo',
            'cinto', 'oculos', 'bolsa', 'relogio', 'brinco', 'colar', 'pulseira', 'anel',
            'outro_acessorios_cabeca', 'outro_tops', 'outro_calcas_saias', 'outro_calcados', 'outro_acessorios'
        ];

        DB::statement("CREATE TYPE categoria_enum AS ENUM ('" . implode("','", $categorias) . "')");
    }

    public function down(): void
    {
        DB::statement('DROP TYPE IF EXISTS categoria_enum');
    }
}; 