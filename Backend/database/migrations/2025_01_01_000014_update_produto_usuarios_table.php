<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Não precisamos alterar nada aqui, apenas manter a estrutura atual
        // Os filtros serão validados via código, não via banco de dados
    }

    public function down(): void
    {
        // Não há nada para reverter
    }
};
