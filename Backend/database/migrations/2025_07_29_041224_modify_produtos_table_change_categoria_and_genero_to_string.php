<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('produtos', function (Blueprint $table) {
            // Alterar categoria de ENUM para string
            $table->string('categoria')->change();
            
            // Alterar genero de ENUM para string
            $table->string('genero')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('produtos', function (Blueprint $table) {
            // Reverter categoria para ENUM
            $table->enum('categoria', ['camiseta', 'blusa', 'camisa', 'jaqueta', 'sueter', 'regata', 'colete', 'casaco', 'calca', 'saia', 'short', 'legging', 'bermuda', 'jardineira', 'tenis', 'sandalia', 'bota', 'sapato', 'chinelo', 'cinto', 'oculos', 'bolsa', 'relogio', 'brinco', 'chapeu', 'bone', 'tiara', 'lenco'])->change();
            
            // Reverter genero para ENUM
            $table->enum('genero', ['masculino', 'feminino', 'unissex'])->change();
        });
    }
};
