<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Produto>
 */
class ProdutoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categorias = [
            'chapeu', 'tiara', 'bone', 'lenco',
            'camiseta', 'camisa', 'blusa', 'jaqueta', 'casaco', 'sueter', 'regata', 'colete',
            'calca', 'saia', 'short', 'legging', 'bermuda', 'jardineira',
            'tenis', 'sandalia', 'bota', 'sapato', 'chinelo',
            'cinto', 'oculos', 'bolsa', 'relogio', 'brinco', 'colar', 'pulseira', 'anel'
        ];

        $estacoes = ['verao', 'outono', 'inverno', 'primavera', 'todas', 'neutra'];
        $ocasioes = ['trabalho', 'festa', 'casual', 'esporte', 'praia', 'balada', 'dia a dia', 'casamento', 'formatura', 'viagem'];
        $estilos = ['classico', 'moderno', 'boho', 'minimalista', 'rocker', 'romantico', 'esportivo', 'urbano', 'vintage'];
        $materiais = ['algodao', 'linho', 'la', 'seda', 'jeans', 'couro', 'moletom', 'viscose', 'poliester'];
        $estadosConservacao = ['novo', 'seminovo', 'usado', 'com defeito', 'restaurado'];
        $cores = ['preto', 'branco', 'azul', 'vermelho', 'verde', 'amarelo', 'rosa', 'roxo', 'laranja', 'marrom', 'cinza', 'bege'];

        return [
            'nome_produto' => fake()->words(2, true),
            'preco' => fake()->randomFloat(2, 10, 500),
            'marca' => fake()->company(),
            'modelo' => fake()->word(),
            'estado_conservacao' => fake()->randomElement($estadosConservacao),
            'estacao' => fake()->randomElement($estacoes),
            'categoria' => fake()->randomElement($categorias),
            'cor' => fake()->randomElement($cores),
            'numeracao' => fake()->randomElement(['P', 'M', 'G', 'GG', '36', '38', '40', '42', '44', '46']),
            'ocasioes' => fake()->randomElements($ocasioes, fake()->numberBetween(1, 3)),
            'estilos' => fake()->randomElements($estilos, fake()->numberBetween(1, 3)),
            'material' => fake()->randomElement($materiais),
        ];
    }
} 