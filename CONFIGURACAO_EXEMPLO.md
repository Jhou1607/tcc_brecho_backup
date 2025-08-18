# 📝 CONFIGURAÇÃO DO ARQUIVO .ENV

## Backend/.env

Copie o arquivo `.env.example` para `.env` na pasta `Backend` e configure com os seguintes valores:

```env
APP_NAME=LoopLook
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=looplook_db
DB_USERNAME=root
DB_PASSWORD=sua_senha_mysql

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

MEMCACHED_HOST=127.0.0.1

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=seu_email@gmail.com
MAIL_PASSWORD=sua_senha_app
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=seu_email@gmail.com
MAIL_FROM_NAME="${APP_NAME}"

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

PUSHER_APP_ID=
PUSHER_APP_KEY=
PUSHER_APP_SECRET=
PUSHER_HOST=
PUSHER_PORT=443
PUSHER_SCHEME=https
PUSHER_APP_CLUSTER=mt1

VITE_APP_NAME="${APP_NAME}"
VITE_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
VITE_PUSHER_HOST="${PUSHER_HOST}"
VITE_PUSHER_PORT="${PUSHER_PORT}"
VITE_PUSHER_SCHEME="${PUSHER_SCHEME}"
VITE_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"

# Google Gemini API Key
GEMINI_API_KEY=AIzaSyBu7E4T9ieYRweTHyKx-N5CEuap0hSQqgQ
```

## Frontend/src/environments/environment.ts

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api',
  imageBaseUrl: 'http://localhost:8000',
  geminiApiKey: 'AIzaSyBu7E4T9ieYRweTHyKx-N5CEuap0hSQqgQ'
};
```

## 🔑 Configuração da API Gemini

1. Acesse: https://makersuite.google.com/app/apikey
2. Faça login com sua conta Google
3. Clique em "Create API Key"
4. Copie a chave gerada
5. Substitua nos arquivos de configuração acima

## 📧 Configuração de Email (Opcional)

Para usar a funcionalidade de recuperação de senha:

1. Configure uma conta Gmail
2. Ative a verificação em duas etapas
3. Gere uma senha de aplicativo:
   - Acesse: https://myaccount.google.com/
   - Segurança → Verificação em duas etapas → Senhas de app
   - Digite "LoopLook" e clique "Criar"
   - Copie a senha de 16 caracteres
4. Use essa senha no campo `MAIL_PASSWORD` do `.env`
