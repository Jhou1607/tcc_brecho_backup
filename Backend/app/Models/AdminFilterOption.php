<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdminFilterOption extends Model
{
    protected $fillable = [
        'filter_type',
        'value',
        'label',
        'is_active',
        'sort_order'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer'
    ];

    // Escopo para filtros ativos
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // Escopo para tipo específico
    public function scopeOfType($query, $type)
    {
        return $query->where('filter_type', $type);
    }

    // Escopo para ordenação
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('label');
    }

    // Relacionamento com produtos (se necessário)
    public function produtos()
    {
        return $this->hasMany(Produto::class, 'cor', 'value');
    }

    // Relacionamento com produtos do usuário (se necessário)
    public function produtoUsuarios()
    {
        return $this->hasMany(ProdutoUsuario::class, 'cor', 'value');
    }
}
