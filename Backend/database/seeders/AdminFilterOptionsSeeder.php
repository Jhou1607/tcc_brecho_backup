<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AdminFilterOptionsSeeder extends Seeder
{
    public function run(): void
    {
        $filters = [
            'cor' => [
                'Branco', 'Preto', 'Azul', 'Vermelho', 'Verde', 'Amarelo', 'Rosa', 'Roxo', 'Laranja', 'Marrom',
                'Cinza', 'Bege', 'Dourado', 'Prata', 'Azul Marinho', 'Verde Escuro', 'Vermelho Escuro', 'Rosa Claro',
                'Azul Claro', 'Verde Claro', 'Amarelo Claro', 'Laranja Claro', 'Roxo Claro', 'Marrom Claro',
                'Azul Céu', 'Verde Oliva', 'Vermelho Bordeaux', 'Rosa Choque', 'Azul Turquesa', 'Verde Esmeralda',
                'Vermelho Coral', 'Rosa Antigo', 'Azul Petróleo', 'Verde Floresta', 'Vermelho Carmim', 'Rosa Pêssego',
                'Azul Royal', 'Verde Militar', 'Vermelho Escarlate', 'Rosa Bebê', 'Azul Índigo', 'Verde Jade',
                'Vermelho Rubi', 'Rosa Salmão', 'Azul Cobalto', 'Verde Lima', 'Vermelho Sangue', 'Rosa Framboesa',
                'Azul Prussiano', 'Verde Menta', 'Vermelho Tomate', 'Rosa Magenta', 'Azul Ultramar', 'Verde Pistache',
                'Vermelho Cereja', 'Rosa Lavanda', 'Azul Celeste', 'Verde Sálvia', 'Vermelho Granada', 'Rosa Coral',
                'Azul Aço', 'Verde Musgo', 'Vermelho Carmesim', 'Rosa Pêssego', 'Azul Marinho', 'Verde Abacate',
                'Vermelho Escuro', 'Rosa Antigo', 'Azul Petróleo', 'Verde Floresta', 'Vermelho Bordeaux', 'Rosa Choque',
                'Azul Turquesa', 'Verde Esmeralda', 'Vermelho Coral', 'Rosa Bebê', 'Azul Royal', 'Verde Militar',
                'Vermelho Escarlate', 'Rosa Salmão', 'Azul Índigo', 'Verde Jade', 'Vermelho Rubi', 'Rosa Framboesa',
                'Azul Cobalto', 'Verde Lima', 'Vermelho Sangue', 'Rosa Magenta', 'Azul Prussiano', 'Verde Menta',
                'Vermelho Tomate', 'Rosa Lavanda', 'Azul Ultramar', 'Verde Pistache', 'Vermelho Cereja', 'Rosa Coral',
                'Azul Celeste', 'Verde Sálvia', 'Vermelho Granada', 'Rosa Pêssego', 'Azul Aço', 'Verde Musgo',
                'Vermelho Carmesim', 'Rosa Antigo', 'Azul Marinho', 'Verde Abacate', 'Vermelho Escuro', 'Rosa Choque'
            ],
            'categoria' => [
                // TOPS (incluindo macacões e vestidos)
                'Camiseta', 'Blusa', 'Camisa', 'Polo', 'Tank Top', 'Suéter', 'Cardigan', 'Túnica', 'Top',
                'Jaqueta', 'Casaco', 'Blazer', 'Trench Coat', 'Parka', 'Blusão', 'Moletom', 'Hoodie',
                'Macacão', 'Jardineira', 'Overalls', 'Macaquinho',
                'Vestido', 'Vestido Longo', 'Vestido Curto', 'Vestido Midi', 'Vestido Tubo', 'Vestido A-Line',
                'Vestido Sheath', 'Vestido Wrap', 'Vestido Maxi', 'Vestido Mini', 'Vestido Boho',
                // CALÇAS E SAIAS
                'Calça', 'Saia', 'Short', 'Bermuda', 'Legging', 'Calça Cargo', 'Calça Skinny', 'Calça Flare',
                'Calça Wide Leg', 'Calça Palazzo', 'Saia Midi', 'Saia Longa', 'Saia Mini', 'Saia Plissada',
                'Saia Tubo', 'Saia Godê',
                // JAQUETAS E CASACOS (mantidos em Tops)
                'Jaqueta Jeans', 'Jaqueta Couro', 'Jaqueta Bomber', 'Jaqueta Blazer',
                'Casaco Inverno', 'Casaco Outono', 'Casaco Primavera', 'Casaco Verão',
                // CALÇADOS
                'Tênis', 'Sapato', 'Sandália', 'Bota', 'Sapatilha', 'Mocassim', 'Oxford', 'Derby',
                'Ankle Boot', 'Chelsea Boot', 'Sneaker', 'Slip-on', 'Loafer',
                // ACESSÓRIOS
                'Bolsa', 'Carteira', 'Mochila', 'Cinto', 'Carteira', 'Pasta', 'Necessaire',
                // ACESSÓRIOS DE CABEÇA
                'Chapéu', 'Boné', 'Tiara', 'Lenço', 'Gorro', 'Turbante', 'Bandana', 'Faixa'
            ],
            'genero' => ['Masculino', 'Feminino', 'Unissex'],
            'material' => [
                'Algodão', 'Poliester', 'Linho', 'Seda', 'Lã', 'Couro', 'Jeans', 'Veludo', 'Cetim',
                'Renda', 'Tricô', 'Malha', 'Brim', 'Sarja', 'Gabardine', 'Tweed', 'Chiffon',
                'Viscose', 'Modal', 'Elastano', 'Acrílico', 'Lycra', 'Nylon', 'Spandex', 'Rayon',
                'Bambu', 'Cânhamo', 'Juta', 'Lã Merino', 'Lã Alpaca', 'Lã Cashmere', 'Seda Natural',
                'Couro Legítimo', 'Couro Sintético', 'Suede', 'Camurça', 'Microfibra', 'Feltro',
                'Tecido Técnico', 'Dry-Fit', 'Neoprene', 'Lycra', 'Elastano', 'Spandex', 'Nylon',
                'Poliamida', 'Acetato', 'Triacetato', 'Polipropileno', 'Poliuretano', 'EVA',
                'Borracha', 'Silicone', 'Látex', 'Vinil', 'PVC', 'Poliéster Reciclado'
            ],
            'estado_conservacao' => ['Novo', 'Semi-novo', 'Usado', 'Vintage', 'Excelente', 'Bom', 'Regular'],
            'numeracao' => [
                'PP', 'P', 'M', 'G', 'GG', 'XG', 'XXG', 'XXXG', '34', '36', '38', '40', '42', '44', '46', '48',
                '50', '52', '54', '56', '58', '60', '62', '64', '66', '68', '70', '72', '74', '76', '78', '80',
                'XS', 'S', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL', '7XL', '8XL', '9XL', '10XL',
                '28', '30', '32', '34', '36', '38', '40', '42', '44', '46', '48', '50', '52', '54', '56', '58',
                '60', '62', '64', '66', '68', '70', '72', '74', '76', '78', '80', '82', '84', '86', '88', '90',
                'Único'
            ],
            'ocasioes' => [
                'Casual', 'Trabalho', 'Festa', 'Esporte', 'Formal', 'Praia', 'Academia', 'Noite',
                'Dia', 'Inverno', 'Verão', 'Outono', 'Primavera', 'Casamento', 'Aniversário',
                'Formatura', 'Viagem', 'Balada', 'Encontro', 'Reunião', 'Apresentação', 'Entrevista',
                'Conferência', 'Seminário', 'Workshop', 'Treinamento', 'Reunião de Negócios',
                'Cocktail', 'Gala', 'Premiação', 'Inauguração', 'Lançamento', 'Exposição',
                'Show', 'Teatro', 'Cinema', 'Restaurante', 'Bar', 'Pub', 'Clube', 'Discoteca',
                'Academia', 'Corrida', 'Ciclismo', 'Natação', 'Tênis', 'Golfe', 'Yoga', 'Pilates',
                'Dança', 'Arte Marcial', 'Crossfit', 'Funcional', 'Spinning', 'Zumba', 'Ballet',
                'Praia', 'Piscina', 'Camping', 'Hiking', 'Escalada', 'Surf', 'Stand Up Paddle',
                'Kitesurf', 'Windsurf', 'Mergulho', 'Pesca', 'Caça', 'Tiro Esportivo'
            ],
            'estilos' => [
                'Vintage', 'Retrô', 'Moderno', 'Clássico', 'Esportivo', 'Elegante', 'Casual', 'Street',
                'Boho', 'Minimalista', 'Romântico', 'Masculino', 'Feminino', 'Unissex', 'Hippie',
                'Gótico', 'Punk', 'Rock', 'Hip Hop', 'Skate', 'Surf', 'Militar', 'Safari', 'Náutico',
                'Country', 'Western', 'Cowboy', 'Indiano', 'Árabe', 'Japonês', 'Chinês', 'Coreano',
                'Tailandês', 'Vietnamita', 'Indonésio', 'Malaio', 'Filipino', 'Singapurense',
                'Australiano', 'Neozelandês', 'Canadense', 'Americano', 'Mexicano', 'Brasileiro',
                'Argentino', 'Chileno', 'Peruano', 'Colombiano', 'Venezuelano', 'Equatoriano',
                'Boliviano', 'Paraguaio', 'Uruguaio', 'Guianês', 'Surinamês', 'Frances',
                'Alemão', 'Italiano', 'Espanhol', 'Português', 'Holandês', 'Belga', 'Suíço',
                'Austríaco', 'Polonês', 'Tcheco', 'Eslovaco', 'Húngaro', 'Romeno', 'Búlgaro',
                'Grego', 'Turco', 'Russo', 'Ucraniano', 'Bielorrusso', 'Moldavo', 'Georgiano',
                'Armênio', 'Azerbaijão', 'Cazaquistão', 'Uzbequistão', 'Turcomenistão', 'Quirguistão',
                'Tajiquistão', 'Afeganistão', 'Paquistão', 'Índia', 'Nepal', 'Butão', 'Bangladesh',
                'Sri Lanka', 'Maldivas', 'Mianmar', 'Tailândia', 'Laos', 'Camboja', 'Vietnã',
                'Malásia', 'Singapura', 'Brunei', 'Filipinas', 'Indonésia', 'Timor-Leste'
            ],
            'estacao' => ['Primavera', 'Verão', 'Outono', 'Inverno', 'Todas as Estações']
        ];

        foreach ($filters as $type => $values) {
            foreach ($values as $index => $value) {
                DB::table('admin_filter_options')->insert([
                    'filter_type' => $type,
                    'value' => strtolower(str_replace(' ', '_', $value)),
                    'label' => $value,
                    'is_active' => true,
                    'sort_order' => $index,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            }
        }
    }
}
