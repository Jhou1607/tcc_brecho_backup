@echo off
echo Configurando LoopLook para producao...

echo.
echo 1. Descobrindo IP local...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /C:"IPv4"') do (
    set IP=%%a
    goto :found
)
:found
set IP=%IP: =%
echo IP encontrado: %IP%

echo.
echo 2. Configurando Frontend...
cd Frontend
echo export const environment = { > src/environments/environment.ts
echo   production: true, >> src/environments/environment.ts
echo   apiUrl: 'http://%IP%:8000/api', >> src/environments/environment.ts
echo   imageBaseUrl: 'http://%IP%:8000', >> src/environments/environment.ts
echo   geminiApiKey: 'AIzaSyBu7E4T9ieYRweTHyKx-N5CEuap0hSQqgQ' >> src/environments/environment.ts
echo }; >> src/environments/environment.ts

echo.
echo 3. Configuracao concluida!
echo.
echo Para rodar o sistema:
echo 1. Terminal 1: cd Backend ^&^& php artisan serve --host 0.0.0.0 --port 8000
echo 2. Terminal 2: cd Frontend ^&^& ng serve --host 0.0.0.0 --port 4200
echo 3. Acesse no celular: http://%IP%:4200
echo.
pause
