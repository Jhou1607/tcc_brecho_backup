# 🚀 CONFIGURAÇÃO PARA PRODUÇÃO E CELULAR

## 📱 Como Rodar no Celular

### 1. Configuração do Backend

#### Opção A: Usando IP Local (Recomendado para Testes)
```bash
# No Backend, execute:
cd Backend
php artisan serve --host 0.0.0.0 --port 8000
```

#### Opção B: Configuração de Produção
Crie um arquivo `.env` no Backend com as seguintes configurações:

```env
APP_NAME=LoopLook
APP_ENV=production
APP_KEY=base64:sua_chave_aqui
APP_DEBUG=false
APP_URL=http://seu_ip_ou_dominio:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=looplook_db
DB_USERNAME=root
DB_PASSWORD=sua_senha_mysql

MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=seu_email@gmail.com
MAIL_PASSWORD=sua_senha_app
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=seu_email@gmail.com
MAIL_FROM_NAME="${APP_NAME}"

# Google Gemini API Key
GEMINI_API_KEY=AIzaSyBu7E4T9ieYRweTHyKx-N5CEuap0hSQqgQ

# Configurações para produção
CACHE_DRIVER=file
SESSION_DRIVER=file
QUEUE_CONNECTION=sync
```

### 2. Configuração do Frontend

#### Atualizar environment.ts para produção:
```typescript
export const environment = {
  production: true,
  apiUrl: 'http://SEU_IP_AQUI:8000/api',
  imageBaseUrl: 'http://SEU_IP_AQUI:8000',
  geminiApiKey: 'AIzaSyBu7E4T9ieYRweTHyKx-N5CEuap0hSQqgQ'
};
```

#### Executar o Frontend:
```bash
# No Frontend, execute:
cd Frontend
ng serve --host 0.0.0.0 --port 4200
```

### 3. Descobrir o IP do Computador

#### Windows:
```cmd
ipconfig
```
Procure por "IPv4 Address" na sua rede local (geralmente 192.168.x.x)

#### Linux/macOS:
```bash
ifconfig
# ou
ip addr show
```

### 4. Acessar no Celular

1. **Conecte o celular na mesma rede Wi-Fi** do computador
2. **Abra o navegador** no celular
3. **Acesse**: `http://SEU_IP:4200`
   - Exemplo: `http://192.168.1.100:4200`

## 🔧 Scripts de Configuração Automática

### Script para Windows (config-producao.bat)
```batch
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
```

### Script para Linux/macOS (config-producao.sh)
```bash
#!/bin/bash
echo "Configurando LoopLook para producao..."

echo
echo "1. Descobrindo IP local..."
IP=$(hostname -I | awk '{print $1}')
echo "IP encontrado: $IP"

echo
echo "2. Configurando Frontend..."
cd Frontend
cat > src/environments/environment.ts << EOF
export const environment = {
  production: true,
  apiUrl: 'http://$IP:8000/api',
  imageBaseUrl: 'http://$IP:8000',
  geminiApiKey: 'AIzaSyBu7E4T9ieYRweTHyKx-N5CEuap0hSQqgQ'
};
EOF

echo
echo "3. Configuração concluída!"
echo
echo "Para rodar o sistema:"
echo "1. Terminal 1: cd Backend && php artisan serve --host 0.0.0.0 --port 8000"
echo "2. Terminal 2: cd Frontend && ng serve --host 0.0.0.0 --port 4200"
echo "3. Acesse no celular: http://$IP:4200"
echo
```

## 🛡️ Configurações de Segurança

### Firewall (Windows)
```cmd
# Permitir porta 8000 (Backend)
netsh advfirewall firewall add rule name="LoopLook Backend" dir=in action=allow protocol=TCP localport=8000

# Permitir porta 4200 (Frontend)
netsh advfirewall firewall add rule name="LoopLook Frontend" dir=in action=allow protocol=TCP localport=4200
```

### Firewall (Linux)
```bash
# Ubuntu/Debian
sudo ufw allow 8000
sudo ufw allow 4200

# CentOS/RHEL
sudo firewall-cmd --permanent --add-port=8000/tcp
sudo firewall-cmd --permanent --add-port=4200/tcp
sudo firewall-cmd --reload
```

## 🔍 Troubleshooting

### Problema: Celular não consegue acessar
**Solução:**
1. Verifique se ambos estão na mesma rede Wi-Fi
2. Desative temporariamente o firewall
3. Teste com `ping SEU_IP` no celular

### Problema: CORS Error
**Solução:**
1. Verifique se o Backend está rodando com `--host 0.0.0.0`
2. Confirme se o CORS está configurado corretamente
3. Limpe o cache do navegador

### Problema: Banco de dados não conecta
**Solução:**
1. Verifique se o MySQL está rodando
2. Confirme as credenciais no `.env`
3. Teste a conexão: `mysql -u root -p`

## 📱 Dicas para Celular

### Performance:
- Use modo de desenvolvimento: `ng serve --host 0.0.0.0 --configuration development`
- Para produção: `ng build --configuration production`

### Debugging:
- Use Chrome DevTools no computador para debugar o celular
- Acesse: `chrome://inspect` no Chrome do computador

### PWA (Progressive Web App):
Para instalar como app no celular, adicione no `index.html`:
```html
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
```

## 🚀 Deploy em Produção Real

### Usando Nginx + PHP-FPM:
```nginx
server {
    listen 80;
    server_name seu-dominio.com;
    
    # Frontend
    location / {
        root /var/www/looplook/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
    location /api {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Usando Docker:
```dockerfile
# Dockerfile para Backend
FROM php:8.2-fpm
# ... configurações do PHP

# Dockerfile para Frontend
FROM nginx:alpine
# ... configurações do Nginx
```

---

**🎉 Agora você pode acessar o LoopLook no seu celular!**
