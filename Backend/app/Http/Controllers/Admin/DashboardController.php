<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use App\Models\Produto;
use App\Models\AdminFilterOption;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        try {
            // Estatísticas básicas
            $totalUsers = Usuario::count();
            $totalProducts = Produto::count();
            
            // Contar filtros ativos vs total
            $totalFilters = AdminFilterOption::count();
            $activeFilters = AdminFilterOption::where('is_active', true)->count();

            // Usuários recentes (últimos 5)
            $recentUsers = Usuario::latest()->take(5)->get();

            // Produtos recentes (últimos 5)
            $recentProducts = Produto::with('imagens')->latest()->take(5)->get();

            return response()->json([
                'totalUsers' => $totalUsers,
                'totalProducts' => $totalProducts,
                'totalFilters' => $totalFilters,
                'activeFilters' => $activeFilters,
                'recentUsers' => $recentUsers,
                'recentProducts' => $recentProducts
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao carregar estatísticas do dashboard',
                'message' => $e->getMessage()
            ], 500);
        }
    }
} 