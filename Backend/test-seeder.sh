#!/bin/bash

echo "🧹 Testando o novo seeder de produtos reais..."
echo ""

# Verificar se estamos no diretório correto
if [ ! -f "artisan" ]; then
    echo "❌ Erro: Execute este script no diretório Backend/"
    exit 1
fi

echo "📋 Verificando estrutura do banco..."
php artisan migrate:status

echo ""
echo "🧹 Executando limpeza e seeder..."
php artisan db:clean-and-seed

echo ""
echo "✅ Teste concluído!"
echo ""
echo "📋 Para verificar os produtos criados:"
echo "php artisan tinker"
echo ">>> App\Models\Produto::count();"
echo ">>> App\Models\Produto::all(['nome_produto', 'preco', 'categoria']);"
