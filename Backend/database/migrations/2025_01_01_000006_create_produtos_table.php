<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('produtos', function (Blueprint $table) {
            $table->id();
            $table->string('nome_produto', 55);
            $table->double('preco');
            $table->string('marca', 55)->nullable();
            $table->string('modelo', 55)->nullable();
            $table->string('estado_conservacao')->nullable();
            $table->string('estacao')->nullable();
            $table->enum('categoria', [
                'chapeu', 'tiara', 'bone', 'lenco',
                'camiseta', 'camisa', 'blusa', 'jaqueta', 'casaco', 'sueter', 'regata', 'colete',
                'calca', 'saia', 'short', 'legging', 'bermuda', 'jardineira',
                'tenis', 'sandalia', 'bota', 'sapato', 'chinelo',
                'cinto', 'oculos', 'bolsa', 'relogio', 'brinco', 'colar', 'pulseira', 'anel',
                'outro_acessorios_cabeca', 'outro_tops', 'outro_calcas_saias', 'outro_calcados', 'outro_acessorios'
            ])->nullable();
            $table->enum('genero', ['masculino', 'feminino', 'unissex'])->nullable();
            $table->string('cor')->nullable();
            $table->string('numeracao', 20)->nullable();
            $table->json('ocasioes')->nullable();
            $table->json('estilos')->nullable();
            $table->string('material', 55)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('produtos');
    }
}; 