<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('produto_usuarios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usuario_id')->constrained('usuarios')->onDelete('cascade');
            $table->string('nome_produto', 55);
            $table->string('marca', 55)->nullable();
            $table->string('categoria', 55)->nullable();
            $table->enum('genero', ['masculino', 'feminino', 'unissex'])->nullable();
            $table->string('estacao', 55)->nullable();
            $table->string('cor', 55)->nullable();
            $table->json('ocasioes')->nullable();
            $table->json('estilos')->nullable();
            $table->string('material', 55)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('produto_usuarios');
    }
}; 