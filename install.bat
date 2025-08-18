@echo off
echo ========================================
echo    INSTALADOR AUTOMATICO - LOOPLOOK
echo ========================================
echo.

echo Verificando requisitos...
echo.

REM Verificar Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Node.js nao encontrado!
    echo Por favor, instale o Node.js 18.x ou superior
    echo Download: https://nodejs.org/
    pause
    exit /b 1
) else (
    echo [OK] Node.js encontrado
)

REM Verificar PHP
php --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] PHP nao encontrado!
    echo Por favor, instale o PHP 8.2 ou superior
    pause
    exit /b 1
) else (
    echo [OK] PHP encontrado
)

REM Verificar Composer
composer --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Composer nao encontrado!
    echo Por favor, instale o Composer
    echo Download: https://getcomposer.org/
    pause
    exit /b 1
) else (
    echo [OK] Composer encontrado
)

echo.
echo Todos os requisitos atendidos!
echo.
echo Iniciando instalacao...
echo.

REM Instalar dependências do Backend
echo [1/4] Instalando dependencias do Backend...
cd Backend
if not exist .env (
    copy .env.example .env
    echo Arquivo .env criado. Configure-o antes de continuar.
    echo.
    echo Pressione qualquer tecla para abrir o arquivo .env...
    pause
    notepad .env
)

composer install
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao instalar dependencias do Backend
    pause
    exit /b 1
)

echo [OK] Dependencias do Backend instaladas
echo.

REM Gerar chave da aplicação
echo [2/4] Gerando chave da aplicacao...
php artisan key:generate
echo [OK] Chave gerada
echo.

REM Voltar para o diretório raiz
cd ..

REM Instalar dependências do Frontend
echo [3/4] Instalando dependencias do Frontend...
cd Frontend
npm install
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao instalar dependencias do Frontend
    pause
    exit /b 1
)
echo [OK] Dependencias do Frontend instaladas
echo.

REM Voltar para o diretório raiz
cd ..

echo [4/4] Instalacao concluida!
echo.
echo ========================================
echo    PROXIMOS PASSOS:
echo ========================================
echo.
echo 1. Configure o banco de dados MySQL
echo 2. Execute as migracoes: cd Backend ^&^& php artisan migrate
echo 3. Execute os seeders: cd Backend ^&^& php artisan db:seed
echo 4. Inicie o Backend: cd Backend ^&^& php artisan serve
echo 5. Inicie o Frontend: cd Frontend ^&^& ng serve
echo.
echo Para mais detalhes, consulte o MANUAL_INSTALACAO.md
echo.
pause
