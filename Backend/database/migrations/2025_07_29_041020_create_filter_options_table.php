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
        Schema::create('filter_options', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // Ex: 'cor', 'categoria', 'estilo'
            $table->string('value'); // Ex: 'azul', 'camiseta', 'vintage'
            $table->string('label')->nullable(); // Ex: 'Azul', 'Camiseta', 'Vintage'
            $table->timestamps();
            
            // Índices para melhor performance
            $table->index('type');
            $table->index(['type', 'value']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('filter_options');
    }
};
