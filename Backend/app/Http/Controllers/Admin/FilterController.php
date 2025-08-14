<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FilterOption;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class FilterController extends Controller
{
    /**
     * Retorna todas as opções de um determinado tipo
     */
    public function index(string $type): JsonResponse
    {
        try {
            $options = FilterOption::getByType($type);
            
            return response()->json([
                'success' => true,
                'data' => $options
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao buscar opções de filtro: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Retorna todos os filtros agrupados por tipo
     */
    public function getAllFiltros(): JsonResponse
    {
        try {
            $filtros = FilterOption::all()->groupBy('type')->map(function ($options, $type) {
                return [
                    'type' => $type,
                    'options' => $options->map(function ($option) {
                        return [
                            'id' => $option->id,
                            'type' => $option->type,
                            'value' => $option->value,
                            'created_at' => $option->created_at,
                            'updated_at' => $option->updated_at
                        ];
                    })
                ];
            })->values();

            return response()->json($filtros);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao buscar filtros: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cria uma nova opção de filtro
     */
    public function store(Request $request, string $type): JsonResponse
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255'
            ]);

            $value = strtolower(trim($request->name));
            
            // Verificar se já existe
            if (FilterOption::exists($type, $value)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Esta opção já existe'
                ], 400);
            }

            $filterOption = FilterOption::create([
                'type' => $type,
                'value' => $value,
                'label' => ucfirst($value)
            ]);

            return response()->json([
                'success' => true,
                'data' => $filterOption,
                'message' => 'Opção criada com sucesso'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao criar opção de filtro: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Atualiza uma opção de filtro
     */
    public function update(Request $request, string $type, int $id): JsonResponse
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255'
            ]);

            $filterOption = FilterOption::find($id);
            
            if (!$filterOption) {
                return response()->json([
                    'success' => false,
                    'message' => 'Opção não encontrada'
                ], 404);
            }

            if ($filterOption->type !== $type) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tipo não corresponde'
                ], 400);
            }

            $newValue = strtolower(trim($request->name));
            
            // Verificar se já existe (exceto a própria)
            if (FilterOption::where('type', $type)
                          ->where('value', $newValue)
                          ->where('id', '!=', $id)
                          ->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Esta opção já existe'
                ], 400);
            }

            $filterOption->update([
                'value' => $newValue,
                'label' => ucfirst($newValue)
            ]);

            return response()->json([
                'success' => true,
                'data' => $filterOption,
                'message' => 'Opção atualizada com sucesso'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao atualizar opção de filtro: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Exclui uma opção de filtro
     */
    public function destroy(string $type, int $id): JsonResponse
    {
        try {
            $filterOption = FilterOption::find($id);
            
            if (!$filterOption) {
                return response()->json([
                    'success' => false,
                    'message' => 'Opção não encontrada'
                ], 404);
            }

            if ($filterOption->type !== $type) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tipo não corresponde'
                ], 400);
            }

            $filterOption->delete();

            return response()->json([
                'success' => true,
                'message' => 'Opção excluída com sucesso'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao excluir opção de filtro: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Retorna todos os tipos disponíveis
     */
    public function types(): JsonResponse
    {
        try {
            $types = FilterOption::getTypes();
            
            return response()->json([
                'success' => true,
                'data' => $types
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao buscar tipos: ' . $e->getMessage()
            ], 500);
        }
    }
}
