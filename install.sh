#!/bin/bash

echo "========================================"
echo "    INSTALADOR AUTOMATICO - LOOPLOOK"
echo "========================================"
echo

echo "Verificando requisitos..."
echo

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "[ERRO] Node.js não encontrado!"
    echo "Por favor, instale o Node.js 18.x ou superior"
    echo "Download: https://nodejs.org/"
    exit 1
else
    echo "[OK] Node.js encontrado"
fi

# Verificar PHP
if ! command -v php &> /dev/null; then
    echo "[ERRO] PHP não encontrado!"
    echo "Por favor, instale o PHP 8.2 ou superior"
    exit 1
else
    echo "[OK] PHP encontrado"
fi

# Verificar Composer
if ! command -v composer &> /dev/null; then
    echo "[ERRO] Composer não encontrado!"
    echo "Por favor, instale o Composer"
    echo "Download: https://getcomposer.org/"
    exit 1
else
    echo "[OK] Composer encontrado"
fi

echo
echo "Todos os requisitos atendidos!"
echo
echo "Iniciando instalação..."
echo

# Instalar dependências do Backend
echo "[1/4] Instalando dependências do Backend..."
cd Backend

if [ ! -f .env ]; then
    cp .env.example .env
    echo "Arquivo .env criado. Configure-o antes de continuar."
    echo
    echo "Pressione Enter para abrir o arquivo .env..."
    read
    if command -v nano &> /dev/null; then
        nano .env
    elif command -v vim &> /dev/null; then
        vim .env
    else
        echo "Por favor, edite o arquivo .env manualmente"
    fi
fi

composer install
if [ $? -ne 0 ]; then
    echo "[ERRO] Falha ao instalar dependências do Backend"
    exit 1
fi

echo "[OK] Dependências do Backend instaladas"
echo

# Gerar chave da aplicação
echo "[2/4] Gerando chave da aplicação..."
php artisan key:generate
echo "[OK] Chave gerada"
echo

# Configurar permissões (Linux/macOS)
echo "[3/4] Configurando permissões..."
chmod -R 775 storage bootstrap/cache
echo "[OK] Permissões configuradas"
echo

# Voltar para o diretório raiz
cd ..

# Instalar dependências do Frontend
echo "[4/4] Instalando dependências do Frontend..."
cd Frontend
npm install
if [ $? -ne 0 ]; then
    echo "[ERRO] Falha ao instalar dependências do Frontend"
    exit 1
fi
echo "[OK] Dependências do Frontend instaladas"
echo

# Voltar para o diretório raiz
cd ..

echo "Instalação concluída!"
echo
echo "========================================"
echo "    PRÓXIMOS PASSOS:"
echo "========================================"
echo
echo "1. Configure o banco de dados MySQL"
echo "2. Execute as migrações: cd Backend && php artisan migrate"
echo "3. Execute os seeders: cd Backend && php artisan db:seed"
echo "4. Inicie o Backend: cd Backend && php artisan serve"
echo "5. Inicie o Frontend: cd Frontend && ng serve"
echo
echo "Para mais detalhes, consulte o MANUAL_INSTALACAO.md"
echo
