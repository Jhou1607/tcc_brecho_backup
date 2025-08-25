<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Esta migration não faz nada - mantém a estrutura original
        // Os campos já estão corretos na migration de criação
    }

    public function down(): void
    {
        // Não há nada para reverter
    }
};
