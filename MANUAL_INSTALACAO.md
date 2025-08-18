# MANUAL DE INSTALAÇÃO - SISTEMA LOOPLOOK

## 📋 ÍNDICE
1. [Visão Geral do Sistema](#visão-geral-do-sistema)
2. [Requisitos do Sistema](#requisitos-do-sistema)
3. [Software Necessário](#software-necessário)
4. [Instalação do Backend (Laravel)](#instalação-do-backend-laravel)
5. [Instalação do Frontend (Angular)](#instalação-do-frontend-angular)
6. [Configuração do Banco de Dados](#configuração-do-banco-de-dados)
7. [Configuração das APIs Externas](#configuração-das-apis-externas)
8. [Executando o Sistema](#executando-o-sistema)
9. [Estrutura de Arquivos](#estrutura-de-arquivos)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 VISÃO GERAL DO SISTEMA

O **LoopLook** é uma plataforma de moda que permite aos usuários:
- Cadastrar e gerenciar produtos de vestuário
- Criar looks personalizados
- Utilizar IA para geração e análise de looks
- Sistema de favoritos e armários virtuais
- Interface administrativa para gestão de produtos e usuários

**Tecnologias Utilizadas:**
- **Backend**: Laravel 11.x (PHP 8.2+)
- **Frontend**: Angular 17.x (TypeScript)
- **Banco de Dados**: MySQL 8.0+
- **UI Framework**: Ng-Zorro Ant Design
- **IA**: Google Gemini API

---

## ⚙️ REQUISITOS DO SISTEMA

### Requisitos Mínimos:
- **Sistema Operacional**: Windows 10/11, macOS 10.15+, ou Linux
- **RAM**: 8GB (recomendado 16GB)
- **Espaço em Disco**: 5GB livres
- **Processador**: Dual-core 2.0GHz ou superior

### Requisitos de Rede:
- Conexão com internet para download de dependências
- Porta 8000 livre (Backend Laravel)
- Porta 4200 livre (Frontend Angular)

---

## 🛠️ SOFTWARE NECESSÁRIO

### 1. Node.js e npm
**Versão**: 18.x ou superior
- **Download**: https://nodejs.org/
- **Verificação**: `node --version` e `npm --version`

### 2. PHP
**Versão**: 8.2 ou superior
- **Windows**: XAMPP ou WAMP
- **macOS**: Homebrew (`brew install php`)
- **Linux**: `sudo apt install php8.2`
- **Verificação**: `php --version`

### 3. Composer
**Versão**: 2.x ou superior
- **Download**: https://getcomposer.org/
- **Verificação**: `composer --version`

### 4. MySQL
**Versão**: 8.0 ou superior
- **Windows**: XAMPP ou MySQL Installer
- **macOS**: Homebrew (`brew install mysql`)
- **Linux**: `sudo apt install mysql-server`
- **Verificação**: `mysql --version`

### 5. Git
**Versão**: 2.x ou superior
- **Download**: https://git-scm.com/
- **Verificação**: `git --version`

---

## 🚀 INSTALAÇÃO DO BACKEND (LARAVEL)

### Passo 1: Configurar o Ambiente
```bash
# Navegar para a pasta do projeto
cd "TCC OFICIAL/Backend"

# Instalar dependências do PHP
composer install

# Copiar arquivo de configuração
cp .env.example .env
```

### Passo 2: Configurar o Arquivo .env
Edite o arquivo `.env` na pasta `Backend` com as seguintes configurações:

```env
APP_NAME=LoopLook
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

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
```

### Passo 3: Gerar Chave da Aplicação
```bash
php artisan key:generate
```

### Passo 4: Configurar Permissões (Linux/macOS)
```bash
chmod -R 775 storage bootstrap/cache
```

---

## ⚡ INSTALAÇÃO DO FRONTEND (ANGULAR)

### Passo 1: Instalar Angular CLI
```bash
npm install -g @angular/cli@17
```

### Passo 2: Configurar o Frontend
```bash
# Navegar para a pasta do Frontend
cd "TCC OFICIAL/Frontend"

# Instalar dependências
npm install
```

### Passo 3: Configurar Variáveis de Ambiente
Edite o arquivo `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api',
  imageBaseUrl: 'http://localhost:8000',
  geminiApiKey: 'AIzaSyBu7E4T9ieYRweTHyKx-N5CEuap0hSQqgQ'
};
```

---

## 🗄️ CONFIGURAÇÃO DO BANCO DE DADOS

### Passo 1: Criar Banco de Dados
```sql
CREATE DATABASE looplook_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Passo 2: Executar Migrações
```bash
cd "TCC OFICIAL/Backend"
php artisan migrate
```

### Passo 3: Executar Seeders
```bash
php artisan db:seed
```

**Dados de Teste Criados:**
- Usuários padrão (admin e usuários comuns)
- Produtos de exemplo
- Categorias e filtros
- Armários e favoritos

**Usuários de Teste:**
- **Admin**: admin@looplook.com / admin123
- **Usuário**: user@looplook.com / user123

---

## 🔧 CONFIGURAÇÃO DAS APIS EXTERNAS

### Google Gemini API
1. Acesse: https://makersuite.google.com/app/apikey
2. Crie uma nova API Key
3. Substitua a chave no arquivo `.env` do Backend
4. Substitua a chave no arquivo `environment.ts` do Frontend

### Configuração de Email (Opcional)
Para funcionalidades de recuperação de senha:
1. Configure uma conta Gmail
2. Ative a verificação em duas etapas
3. Gere uma senha de aplicativo
4. Configure no arquivo `.env`

---

## ▶️ EXECUTANDO O SISTEMA

### Terminal 1: Backend Laravel
```bash
cd "TCC OFICIAL/Backend"
php artisan serve
```
**Acesso**: http://localhost:8000

### Terminal 2: Frontend Angular
```bash
cd "TCC OFICIAL/Frontend"
ng serve
```
**Acesso**: http://localhost:4200

### Verificação do Sistema
1. Acesse http://localhost:4200
2. Teste o cadastro de usuário
3. Teste o login
4. Verifique as funcionalidades principais

---

## 📁 ESTRUTURA DE ARQUIVOS

```
TCC OFICIAL/
├── Backend/                    # API Laravel
│   ├── app/
│   │   ├── Http/Controllers/   # Controladores da API
│   │   ├── Models/            # Modelos do banco
│   │   └── Mail/              # Templates de email
│   ├── database/
│   │   ├── migrations/        # Estrutura do banco
│   │   └── seeders/           # Dados iniciais
│   ├── routes/
│   │   └── api.php           # Rotas da API
│   └── .env                   # Configurações
├── Frontend/                   # Aplicação Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── admin/         # Área administrativa
│   │   │   ├── pages/         # Páginas principais
│   │   │   ├── services/      # Serviços da API
│   │   │   └── shared/        # Componentes compartilhados
│   │   ├── assets/            # Imagens e recursos
│   │   └── environments/      # Configurações de ambiente
│   └── package.json           # Dependências Node.js
└── MANUAL_INSTALACAO.md       # Este arquivo
```

---

## 🔍 TROUBLESHOOTING

### Problemas Comuns:

#### 1. Erro de Conexão com Banco
```bash
# Verificar se MySQL está rodando
# Windows: Serviços > MySQL
# Linux/macOS: sudo systemctl start mysql
```

#### 2. Erro de Permissões (Linux/macOS)
```bash
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

#### 3. Erro de Dependências Node.js
```bash
cd Frontend
rm -rf node_modules package-lock.json
npm install
```

#### 4. Erro de Dependências PHP
```bash
cd Backend
rm -rf vendor composer.lock
composer install
```

#### 5. Porta Já em Uso
```bash
# Verificar processos nas portas
netstat -ano | findstr :8000
netstat -ano | findstr :4200

# Matar processo específico
taskkill /PID [número_do_processo] /F
```

#### 6. Erro de CORS
Verificar se o Backend está rodando em http://localhost:8000 e o Frontend em http://localhost:4200

---

## 📞 SUPORTE

### Informações do Projeto:
- **Nome**: LoopLook - Sistema de Moda com IA
- **Versão**: 1.0.0
- **Data**: 2025
- **Equipe**: [Nome da Equipe]

### Contatos:
- **Email**: [email_contato]
- **GitHub**: [link_repositório]

### Documentação Adicional:
- **Laravel**: https://laravel.com/docs
- **Angular**: https://angular.io/docs
- **Ng-Zorro**: https://ng.ant.design/docs/introduce/en

---

## ✅ CHECKLIST DE INSTALAÇÃO

- [ ] Node.js 18.x+ instalado
- [ ] PHP 8.2+ instalado
- [ ] Composer instalado
- [ ] MySQL 8.0+ instalado
- [ ] Git instalado
- [ ] Backend configurado (.env)
- [ ] Frontend configurado (environment.ts)
- [ ] Banco de dados criado
- [ ] Migrações executadas
- [ ] Seeders executados
- [ ] API Gemini configurada
- [ ] Backend rodando (porta 8000)
- [ ] Frontend rodando (porta 4200)
- [ ] Sistema testado e funcionando

---

**🎉 Parabéns! O sistema LoopLook está instalado e pronto para uso!**
