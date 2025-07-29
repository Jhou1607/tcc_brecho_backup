<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\FilterOption;

class FilterOptionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Limpar dados existentes
        FilterOption::query()->delete();

        $filterData = [
            'categoria' => [
                'camiseta', 'blusa', 'camisa', 'jaqueta', 'sueter', 'regata', 'colete', 'casaco',
                'calca', 'saia', 'short', 'legging', 'bermuda', 'jardineira',
                'tenis', 'sandalia', 'bota', 'sapato', 'chinelo',
                'cinto', 'oculos', 'bolsa', 'relogio', 'brinco',
                'chapeu', 'bone', 'tiara', 'lenco'
            ],
            'cor' => [
                'preto', 'branco', 'azul', 'vermelho', 'verde', 'amarelo', 'rosa', 'roxo',
                'laranja', 'marrom', 'cinza', 'bege', 'prateado'
            ],
            'marca' => [
                'Nike', 'Adidas', 'Zara', 'H&M', 'Ralph Lauren', 'Levi\'s', 'Tommy Hilfiger',
                'Banana Republic', 'Under Armour', 'Gap', 'The North Face', 'Columbia',
                'Canada Goose', 'Uniqlo', 'Forever 21', 'Lacoste', 'AllSaints',
                'Steve Madden', 'Dr. Martens', 'Clarks', 'Havaianas', 'Fossil',
                'Ray-Ban', 'Michael Kors', 'Pandora', 'Eugenia Kim', 'New Era',
                'ASOS', 'Hermès', 'Stetson'
            ],
            'estilo' => [
                'classico', 'moderno', 'boho', 'minimalista', 'rocker', 'romantico',
                'esportivo', 'urbano', 'vintage'
            ],
            'ocasiao' => [
                'trabalho', 'festa', 'casual', 'esporte', 'praia', 'balada', 'dia a dia'
            ],
            'estacao' => [
                'verao', 'outono', 'inverno', 'primavera', 'todas'
            ],
            'material' => [
                'algodao', 'linho', 'la', 'seda', 'jeans', 'couro', 'moletom',
                'viscose', 'poliester'
            ],
            'genero' => [
                'masculino', 'feminino', 'unissex'
            ]
        ];

        foreach ($filterData as $type => $values) {
            foreach ($values as $value) {
                FilterOption::create([
                    'type' => $type,
                    'value' => $value,
                    'label' => ucfirst($value) // Capitalizar primeira letra
                ]);
            }
        }

        echo "Filtros populados com sucesso!\n";
        echo "Total de tipos: " . count($filterData) . "\n";
        echo "Total de opções: " . array_sum(array_map('count', $filterData)) . "\n";
    }
}
