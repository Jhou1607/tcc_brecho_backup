<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('admin_filter_options', function (Blueprint $table) {
            $table->id();
            $table->string('filter_type'); // 'cor', 'categoria', 'genero', 'material', 'estado', 'numeracao', 'ocasioes', 'estilos', 'estacao'
            $table->string('value'); // valor do filtro
            $table->string('label'); // label para exibição
            $table->boolean('is_active')->default(true); // se está ativo/visível
            $table->integer('sort_order')->default(0); // ordem de exibição
            $table->timestamps();
            
            // Índices para melhor performance
            $table->index('filter_type');
            $table->index(['filter_type', 'is_active']);
            $table->index(['filter_type', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('admin_filter_options');
    }
};
