<?php

namespace Database\Factories;

use App\Models\Usuario;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProdutoUsuario>
 */
class ProdutoUsuarioFactory extends Factory
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
        $cores = ['preto', 'branco', 'azul', 'vermelho', 'verde', 'amarelo', 'rosa', 'roxo', 'laranja', 'marrom', 'cinza', 'bege'];

        return [
            'usuario_id' => Usuario::factory(),
            'nome_produto' => fake()->words(2, true),
            'marca' => fake()->company(),
            'categoria' => fake()->randomElement($categorias),
            'estacao' => fake()->randomElement($estacoes),
            'cor' => fake()->randomElement($cores),
            'ocasioes' => fake()->randomElements($ocasioes, fake()->numberBetween(1, 3)),
            'estilos' => fake()->randomElements($estilos, fake()->numberBetween(1, 3)),
            'material' => fake()->randomElement($materiais),
        ];
    }
} 