# 🚀 GUIA COMPLETO DE INSTALAÇÃO - LOOPLOOK

## 📋 ÍNDICE
1. [Visão Geral](#visão-geral)
2. [Requisitos do Sistema](#requisitos-do-sistema)
3. [Software Necessário](#software-necessário)
4. [Instalação do Software](#instalação-do-software)
5. [Configuração do Ambiente](#configuração-do-ambiente)
6. [Instalação do Projeto](#instalação-do-projeto)
7. [Configuração do Banco de Dados](#configuração-do-banco-de-dados)
8. [Executando o Sistema](#executando-o-sistema)
9. [Troubleshooting](#troubleshooting)
10. [Checklist Final](#checklist-final)

---

## 🎯 VISÃO GERAL

O **LoopLook** é uma plataforma de moda com IA que permite:
- Cadastrar e gerenciar produtos de vestuário
- Criar looks personalizados
- Utilizar IA (Google Gemini) para geração e análise de looks
- Sistema de favoritos e armários virtuais
- Interface administrativa completa

**Tecnologias:**
- **Backend**: Laravel 12.x (PHP 8.2+)
- **Frontend**: Angular 19.x (TypeScript)
- **Banco**: MySQL 8.0+ ou SQLite
- **UI**: Ng-Zorro Ant Design
- **IA**: Google Gemini API

---

## ⚙️ REQUISITOS DO SISTEMA

### Mínimos:
- **OS**: Windows 10/11, macOS 10.15+, Linux Ubuntu 20.04+
- **RAM**: 8GB (recomendado 16GB)
- **Disco**: 5GB livres
- **CPU**: Dual-core 2.0GHz+
- **Rede**: Conexão com internet

### Portas Necessárias:
- **8000**: Backend Laravel
- **4200**: Frontend Angular
- **3306**: MySQL (se usar MySQL)

---

## 🛠️ SOFTWARE NECESSÁRIO

### 1. 🔗 Git
**Versão**: 2.40+ ou superior
- **Windows**: https://git-scm.com/download/win
- **macOS**: `brew install git` ou https://git-scm.com/download/mac
- **Linux**: `sudo apt install git` (Ubuntu/Debian)
- **Verificação**: `git --version`

### 2. 📦 Node.js e npm
**Versão**: 18.x ou superior (recomendado 20.x LTS)
- **Download**: https://nodejs.org/
- **Escolha**: LTS (Long Term Support)
- **Verificação**: 
  ```bash
  node --version  # deve mostrar v18.x.x ou superior
  npm --version   # deve mostrar 9.x.x ou superior
  ```

### 3. 🐘 PHP
**Versão**: 8.2 ou superior (recomendado 8.3)
- **Windows**: 
  - XAMPP: https://www.apachefriends.org/
  - WAMP: https://www.wampserver.com/
  - Ou PHP standalone: https://windows.php.net/download/
- **macOS**: 
  ```bash
  brew install php@8.3
  brew link php@8.3
  ```
- **Linux Ubuntu/Debian**:
  ```bash
  sudo apt update
  sudo apt install php8.3 php8.3-cli php8.3-fpm php8.3-mysql php8.3-xml php8.3-mbstring php8.3-curl php8.3-zip php8.3-gd php8.3-bcmath
  ```
- **Verificação**: `php --version`

### 4. 🎼 Composer
**Versão**: 2.x ou superior
- **Download**: https://getcomposer.org/download/
- **Windows**: Baixe o instalador .exe
- **macOS/Linux**: 
  ```bash
  curl -sS https://getcomposer.org/installer | php
  sudo mv composer.phar /usr/local/bin/composer
  ```
- **Verificação**: `composer --version`

### 5. 🗄️ Banco de Dados
**Opção A - MySQL 8.0+ (Recomendado)**:
- **Windows**: Incluído no XAMPP/WAMP
- **macOS**: `brew install mysql`
- **Linux**: `sudo apt install mysql-server`
- **Verificação**: `mysql --version`

**Opção B - SQLite (Mais Simples)**:
- Já incluído no PHP
- Não precisa instalação adicional

### 6. 📧 Angular CLI
**Instalação Global**:
```bash
npm install -g @angular/cli@19
```
- **Verificação**: `ng version`

---

## 🔧 INSTALAÇÃO DO SOFTWARE

### Windows:

#### 1. Instalar Git
1. Baixe o instalador do Git
2. Execute como administrador
3. Use as configurações padrão
4. Adicione ao PATH automaticamente

#### 2. Instalar Node.js
1. Baixe a versão LTS do Node.js
2. Execute o instalador
3. Marque "Add to PATH"
4. Reinicie o terminal

#### 3. Instalar PHP (XAMPP)
1. Baixe o XAMPP
2. Execute como administrador
3. Instale Apache, MySQL, PHP
4. Adicione ao PATH: `C:\xampp\php`

#### 4. Instalar Composer
1. Baixe o instalador do Composer
2. Execute como administrador
3. Use o PHP do XAMPP quando solicitado

#### 5. Configurar Variáveis de Ambiente
1. Abra "Configurações do Sistema"
2. Clique em "Variáveis de Ambiente"
3. Adicione ao PATH:
   - `C:\xampp\php`
   - `C:\xampp\mysql\bin`
   - `C:\Program Files\Git\bin`

### macOS:

#### 1. Instalar Homebrew (se não tiver)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

#### 2. Instalar Software
```bash
# Git
brew install git

# Node.js
brew install node

# PHP
brew install php@8.3
brew link php@8.3

# Composer
brew install composer

# MySQL
brew install mysql
brew services start mysql

# Angular CLI
npm install -g @angular/cli@19
```

### Linux (Ubuntu/Debian):

#### 1. Atualizar Sistema
```bash
sudo apt update && sudo apt upgrade -y
```

#### 2. Instalar Software
```bash
# Git
sudo apt install git -y

# Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs -y

# PHP
sudo apt install php8.3 php8.3-cli php8.3-fpm php8.3-mysql php8.3-xml php8.3-mbstring php8.3-curl php8.3-zip php8.3-gd php8.3-bcmath -y

# Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# MySQL
sudo apt install mysql-server -y
sudo mysql_secure_installation

# Angular CLI
sudo npm install -g @angular/cli@19
```

---

## ⚙️ CONFIGURAÇÃO DO AMBIENTE

### 1. Configurar PHP (php.ini)

#### Localizar php.ini:
```bash
php --ini
```

#### Configurações Necessárias:
```ini
# Upload de arquivos
upload_max_filesize = 50M
post_max_size = 50M
max_execution_time = 300
max_input_time = 300
memory_limit = 512M

# Extensões necessárias
extension=mysqli
extension=pdo_mysql
extension=gd
extension=curl
extension=zip
extension=mbstring
extension=xml
extension=bcmath

# Configurações de sessão
session.gc_maxlifetime = 7200
```

#### Windows (XAMPP):
- Edite: `C:\xampp\php\php.ini`
- Reinicie o Apache

#### macOS:
- Edite: `/usr/local/etc/php/8.3/php.ini`
- Reinicie: `brew services restart php@8.3`

#### Linux:
- Edite: `/etc/php/8.3/cli/php.ini`
- Reinicie: `sudo systemctl restart php8.3-fpm`

### 2. Configurar MySQL (se usar MySQL)

#### Criar Banco de Dados:
```sql
-- Conectar ao MySQL
mysql -u root -p

-- Criar banco
CREATE DATABASE looplook_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Criar usuário (opcional)
CREATE USER 'looplook_user'@'localhost' IDENTIFIED BY 'sua_senha';
GRANT ALL PRIVILEGES ON looplook_db.* TO 'looplook_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Configurar Certificados SSL (se necessário)

#### Windows:
- Baixe: https://curl.se/ca/cacert.pem
- Salve em: `C:\xampp\php\extras\ssl\cacert.pem`
- Adicione ao php.ini:
  ```ini
  curl.cainfo = "C:\xampp\php\extras\ssl\cacert.pem"
  ```

#### macOS/Linux:
```bash
# Baixar certificados
sudo curl -o /etc/ssl/certs/cacert.pem https://curl.se/ca/cacert.pem

# Configurar no php.ini
curl.cainfo = "/etc/ssl/certs/cacert.pem"
```

---

## 📥 INSTALAÇÃO DO PROJETO

### 1. Baixar o Projeto
```bash
# Clone o repositório (se estiver no Git)
git clone [URL_DO_REPOSITORIO] "TCC OFICIAL"

# Ou extraia o arquivo ZIP na pasta desejada
```

### 2. Usar Scripts Automáticos

#### Windows:
```bash
# Navegar para a pasta do projeto
cd "TCC OFICIAL"

# Executar instalador automático
install.bat
```

#### Linux/macOS:
```bash
# Navegar para a pasta do projeto
cd "TCC OFICIAL"

# Tornar executável
chmod +x install.sh

# Executar instalador automático
./install.sh
```

### 3. Instalação Manual

#### Backend (Laravel):
```bash
# Navegar para pasta Backend
cd "TCC OFICIAL/Backend"

# Instalar dependências PHP
composer install

# Copiar arquivo de configuração
cp .env.example .env

# Gerar chave da aplicação
php artisan key:generate

# Configurar permissões (Linux/macOS)
chmod -R 775 storage bootstrap/cache
```

#### Frontend (Angular):
```bash
# Navegar para pasta Frontend
cd "TCC OFICIAL/Frontend"

# Instalar dependências Node.js
npm install
```

---

## 🗄️ CONFIGURAÇÃO DO BANCO DE DADOS

### 1. Configurar Arquivo .env

Edite `Backend/.env`:

```env
APP_NAME=LoopLook
APP_ENV=local
APP_KEY=base64:sua_chave_gerada_automaticamente
APP_DEBUG=true
APP_URL=http://localhost:8000

# Banco de Dados - MySQL
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=looplook_db
DB_USERNAME=root
DB_PASSWORD=sua_senha_mysql

# OU Banco de Dados - SQLite (mais simples)
# DB_CONNECTION=sqlite
# DB_DATABASE=database/database.sqlite

# Email (opcional)
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=seu_email@gmail.com
MAIL_PASSWORD=sua_senha_app
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=seu_email@gmail.com
MAIL_FROM_NAME="${APP_NAME}"

# Google Gemini API
GEMINI_API_KEY=AIzaSyBu7E4T9ieYRweTHyKx-N5CEuap0hSQqgQ
```

### 2. Executar Migrações e Seeders

```bash
# Navegar para Backend
cd "TCC OFICIAL/Backend"

# Executar migrações (criar tabelas)
php artisan migrate

# Executar seeders (dados iniciais)
php artisan db:seed

# Criar link simbólico para storage (se necessário)
php artisan storage:link
```

### 3. Configurar Frontend

Edite `Frontend/src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api',
  imageBaseUrl: 'http://localhost:8000',
  geminiApiKey: 'AIzaSyBu7E4T9ieYRweTHyKx-N5CEuap0hSQqgQ'
};
```

---

## ▶️ EXECUTANDO O SISTEMA

### 1. Iniciar Backend
```bash
# Terminal 1
cd "TCC OFICIAL/Backend"
php artisan serve
```
**Acesso**: http://localhost:8000

### 2. Iniciar Frontend
```bash
# Terminal 2
cd "TCC OFICIAL/Frontend"
ng serve
```
**Acesso**: http://localhost:4200

### 3. Verificar Funcionamento
1. Acesse http://localhost:4200
2. Teste o cadastro de usuário
3. Teste o login
4. Verifique as funcionalidades principais

### 4. Usuários de Teste
- **Admin**: admin@looplook.com / admin123
- **Usuário**: user@looplook.com / user123

---

## 🔍 TROUBLESHOOTING

### Problemas Comuns:

#### 1. ❌ "Node.js não encontrado"
**Solução:**
- Reinstale o Node.js
- Verifique se está no PATH: `echo $PATH` (Linux/macOS) ou `echo %PATH%` (Windows)
- Reinicie o terminal

#### 2. ❌ "PHP não encontrado"
**Solução:**
- Verifique instalação: `php --version`
- Adicione ao PATH manualmente
- Reinicie o terminal

#### 3. ❌ "Composer não encontrado"
**Solução:**
- Reinstale o Composer
- Verifique PATH
- Teste: `composer --version`

#### 4. ❌ "Erro de conexão com banco"
**Solução:**
```bash
# Verificar se MySQL está rodando
# Windows: Serviços > MySQL
# Linux: sudo systemctl status mysql
# macOS: brew services list | grep mysql

# Testar conexão
mysql -u root -p
```

#### 5. ❌ "Erro de permissões (Linux/macOS)"
**Solução:**
```bash
cd "TCC OFICIAL/Backend"
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

#### 6. ❌ "Erro de dependências Node.js"
**Solução:**
```bash
cd "TCC OFICIAL/Frontend"
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

#### 7. ❌ "Erro de dependências PHP"
**Solução:**
```bash
cd "TCC OFICIAL/Backend"
rm -rf vendor composer.lock
composer clear-cache
composer install
```

#### 8. ❌ "Porta já em uso"
**Solução:**
```bash
# Verificar processos
# Windows:
netstat -ano | findstr :8000
netstat -ano | findstr :4200

# Linux/macOS:
lsof -i :8000
lsof -i :4200

# Matar processo
# Windows:
taskkill /PID [número] /F

# Linux/macOS:
kill -9 [PID]
```

#### 9. ❌ "Erro de CORS"
**Solução:**
- Verifique se Backend está em http://localhost:8000
- Verifique se Frontend está em http://localhost:4200
- Limpe cache do navegador

#### 10. ❌ "Erro de upload de arquivos"
**Solução:**
- Verifique configurações do php.ini
- Aumente `upload_max_filesize` e `post_max_size`
- Reinicie o servidor web

---

## ✅ CHECKLIST FINAL

### Software Instalado:
- [ ] Git 2.40+
- [ ] Node.js 18.x+ (com npm)
- [ ] PHP 8.2+ (com extensões necessárias)
- [ ] Composer 2.x+
- [ ] MySQL 8.0+ (ou SQLite)
- [ ] Angular CLI 19.x

### Configurações:
- [ ] PHP.ini configurado
- [ ] Variáveis de ambiente (PATH) configuradas
- [ ] Certificados SSL (se necessário)
- [ ] Banco de dados criado

### Projeto:
- [ ] Projeto baixado/extraído
- [ ] Dependências do Backend instaladas
- [ ] Dependências do Frontend instaladas
- [ ] Arquivo .env configurado
- [ ] Arquivo environment.ts configurado
- [ ] Migrações executadas
- [ ] Seeders executados

### Funcionamento:
- [ ] Backend rodando (porta 8000)
- [ ] Frontend rodando (porta 4200)
- [ ] Sistema acessível via navegador
- [ ] Login funcionando
- [ ] Funcionalidades principais testadas

---

## 📞 SUPORTE

### Informações do Projeto:
- **Nome**: LoopLook - Sistema de Moda com IA
- **Versão**: 1.0.0
- **Tecnologias**: Laravel 12.x + Angular 19.x
- **Banco**: MySQL 8.0+ ou SQLite

### Links Úteis:
- **Laravel**: https://laravel.com/docs
- **Angular**: https://angular.io/docs
- **Ng-Zorro**: https://ng.ant.design/docs/introduce/en
- **Google Gemini**: https://makersuite.google.com/app/apikey

### Comandos de Verificação:
```bash
# Verificar versões
git --version
node --version
npm --version
php --version
composer --version
ng version
mysql --version

# Verificar se serviços estão rodando
php artisan serve --port=8000
ng serve --port=4200
```

---

**🎉 Parabéns! O sistema LoopLook está instalado e pronto para uso!**

Para dúvidas específicas, consulte o `MANUAL_INSTALACAO.md` ou os arquivos de configuração no projeto.
