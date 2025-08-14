<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory; // <<-- ESTA LINHA É CRUCIAL

class Look extends Model {
    use HasFactory; // <<-- E esta também.

    protected $fillable = ['usuario_id', 'nome_look', 'configuracao', 'imagem_url'];
    protected $casts = ['configuracao' => 'array'];

    public function usuario() // Nome do relacionamento para 'usuario_id'
    {
        return $this->belongsTo(Usuario::class, 'usuario_id'); // Referencia Usuario::class e 'usuario_id'
    }
}