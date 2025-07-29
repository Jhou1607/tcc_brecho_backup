<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Produto extends Model
{
    use HasFactory;

    protected $table = 'produtos';

    protected $fillable = [
        'nome_produto',
        'preco',
        'marca',
        'modelo',
        'estado_conservacao',
        'estacao',
        'categoria',
        'genero',
        'cor',
        'numeracao',
        'ocasioes',
        'estilos',
        'material',
    ];

    protected $casts = [
        'ocasioes' => 'array',
        'estilos' => 'array',
    ];

    protected $appends = ['image_url'];

    public function imagens(): MorphMany
    {
        return $this->morphMany(Imagem::class, 'imageable');
    }

    public function getImageUrlAttribute()
    {
        $imagem = $this->imagens()->where('is_principal', true)->first();
        if ($imagem) {
            return url('api/images/' . $imagem->url);
        }
        return null;
    }

    public function favoritos(): BelongsToMany
    {
        return $this->belongsToMany(Usuario::class, 'favoritos', 'produto_id', 'usuario_id')->withTimestamps();
    }

    public function armarios(): MorphMany
    {
        return $this->morphMany(Armario::class, 'item');
    }

    public function toArray()
    {
        $array = parent::toArray();

        if ($this->relationLoaded('imagens')) {
            $array['images'] = $this->imagens->map(function ($imagem) {
                $imageUrl = $imagem->url;
                $finalUrl = null;

                if ($imageUrl) {
                    if (Str::startsWith($imageUrl, ['http://', 'https://'])) {
                        $finalUrl = $imageUrl;
                    } else {
                        $finalUrl = asset('storage/' . $imageUrl);
                    }
                }

                return [
                    'id' => $imagem->id,
                    'url' => $finalUrl,
                    'is_principal' => $imagem->is_principal,
                ];
            })->toArray();
        } else {
            $array['images'] = [];
        }

        return $array;
    }
}
