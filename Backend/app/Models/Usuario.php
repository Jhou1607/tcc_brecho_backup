<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Usuario extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'usuarios';

    protected $fillable = [
        'nome_usuario',
        'email',
        'password',
        'sexo',
        'data_nascimento',
        'foto_url',
        'bio',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'data_nascimento' => 'date',
        'password' => 'hashed',
    ];

    /**
     * Verificar se o usuário é admin
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Verificar se o usuário tem uma role específica
     */
    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    // RELACIONAMENTO PARA LOOKS
    public function looks(): HasMany // Este relacionamento é o que LookController@index e show usam
    {
        return $this->hasMany(Look::class, 'usuario_id'); // Aponta para a FK 'usuario_id' na tabela 'looks'
    }

    public function favoritos(): BelongsToMany
    {
        return $this->belongsToMany(Produto::class, 'favoritos', 'usuario_id', 'produto_id')->withTimestamps();
    }

    public function produtosProprios(): HasMany
    {
        return $this->hasMany(ProdutoUsuario::class, 'usuario_id');
    }

    public function armarios(): HasMany
    {
        return $this->hasMany(Armario::class, 'usuario_id');
    }
}