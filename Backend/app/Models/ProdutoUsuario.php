<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Str;

class ProdutoUsuario extends Model
{
    use HasFactory;

    protected $table = 'produto_usuarios';

    protected $fillable = [
        'nome_produto',
        'marca',
        'estacao',
        'categoria',
        'cor',
        'usuario_id',
        'ocasioes',
        'estilos',
        'material',
    ];

    protected $casts = [
        'ocasioes' => 'array',
        'estilos' => 'array',
    ];

    protected $appends = ['image_url'];

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }

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
