<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FilterOption extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'value',
        'label'
    ];

    /**
     * Buscar opções por tipo
     */
    public static function getByType(string $type): \Illuminate\Database\Eloquent\Collection
    {
        return self::where('type', $type)->orderBy('value')->get();
    }

    /**
     * Buscar todos os tipos disponíveis
     */
    public static function getTypes(): array
    {
        return self::distinct('type')->pluck('type')->toArray();
    }

    /**
     * Verificar se uma opção existe
     */
    public static function exists(string $type, string $value): bool
    {
        return self::where('type', $type)->where('value', $value)->exists();
    }
}
