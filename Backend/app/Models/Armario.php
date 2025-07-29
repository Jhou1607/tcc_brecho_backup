<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Armario extends Model
{
    use HasFactory;

    protected $table = 'armarios';

    protected $fillable = [
        'usuario_id',
        'item_id',
        'item_type',
    ];

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }

    public function item(): MorphTo
    {
        return $this->morphTo();
    }
}
