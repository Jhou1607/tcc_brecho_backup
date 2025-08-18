<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('usuarios', function (Blueprint $table) {
            $table->id();
            $table->string('nome_usuario', 55);
            $table->string('email', 55)->unique();
            $table->enum('role', ['user', 'admin'])->default('user');
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('remember_token', 100)->nullable();
            $table->string('sexo')->nullable();
            $table->date('data_nascimento')->nullable();
            $table->string('foto_url', 2048)->nullable();
            $table->text('bio')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('usuarios');
    }
}; 