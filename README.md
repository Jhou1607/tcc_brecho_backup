# 🛍️ Brecho LoopLook - Sistema de Brechó Digital

## 📋 Descrição
Sistema completo de brechó digital desenvolvido em Angular 19 (Frontend) e Laravel 12 (Backend), com funcionalidades de catálogo, busca, favoritos, montador de looks e painel administrativo.

## 🚀 Tecnologias Utilizadas

### Frontend
- **Angular 19** - Framework principal
- **TypeScript** - Linguagem de programação
- **Ng-Zorro Ant Design** - Biblioteca de componentes UI
- **FontAwesome** - Ícones
- **Fabric.js** - Manipulação de canvas
- **RxJS** - Programação reativa

### Backend
- **Laravel 12** - Framework PHP
- **PHP 8.2+** - Linguagem de programação
- **PostgreSQL** - Banco de dados
- **Laravel Sanctum** - Autenticação API
- **Eloquent ORM** - ORM do Laravel

## 📦 Pré-requisitos

### Software Necessário
1. **Node.js 18+** - [Download aqui](https://nodejs.org/)
2. **PHP 8.2+** - [Download aqui](https://php.net/)
3. **Composer** - [Download aqui](https://getcomposer.org/)
4. **PostgreSQL 12+** - [Download aqui](https://www.postgresql.org/)
5. **Git** - [Download aqui](https://git-scm.com/)

### Extensões PHP Necessárias
```bash
php -m | grep -E "(pdo|pgsql|mbstring|openssl|tokenizer|xml|ctype|json|bcmath)"
```

## 🛠️ Instalação e Configuração

### 1. Clone o Repositório
```bash
git clone https://github.com/Jhou1607/tcc_brecho_backup.git
cd tcc_brecho_backup
```

### 2. Configuração do Backend (Laravel)

#### 2.1. Instalar Dependências
```bash
cd Backend
composer install
```

#### 2.2. Configurar Ambiente
```bash
# Copiar arquivo de ambiente
cp .env.example .env

# Gerar chave da aplicação
php artisan key:generate
```

#### 2.3. Configurar Banco de Dados
Edite o arquivo `.env`:
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=tcc_brecho
DB_USERNAME=postgres
DB_PASSWORD=sua_senha_postgres
```

#### 2.4. Executar Migrations
```bash
php artisan migrate
```

#### 2.5. Executar Seeders
```bash
php artisan db:seed
```

#### 2.6. Configurar Storage
```bash
php artisan storage:link
```

#### 2.7. Configurar Email (Opcional)
Para funcionalidade de recuperação de senha, configure no `.env`:
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=seu_email@gmail.com
MAIL_PASSWORD=sua_senha_de_app
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=seu_email@gmail.com
MAIL_FROM_NAME="Brecho LoopLook"
```

### 3. Configuração do Frontend (Angular)

#### 3.1. Instalar Dependências
```bash
cd ../Frontend
npm install
```

#### 3.2. Configurar Ambiente
Edite `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api'
};
```

## 🚀 Executando o Projeto

### 1. Iniciar Backend
```bash
cd Backend
php artisan serve
```
O backend estará disponível em: http://localhost:8000

### 2. Iniciar Frontend
```bash
cd Frontend
ng serve
```
O frontend estará disponível em: http://localhost:4200

## 📁 Estrutura do Projeto

```
Projeto TCC/
├── Backend/                 # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/
│   │   ├── Models/
│   │   └── Mail/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── routes/
│   └── resources/
├── Frontend/               # Angular App
│   ├── src/
│   │   ├── app/
│   │   │   ├── pages/
│   │   │   ├── admin/
│   │   │   └── shared/
│   │   ├── environments/
│   │   └── styles/
│   └── angular.json
└── README.md
```

## 🔧 Funcionalidades Principais

### Frontend
- ✅ **Catálogo de Produtos** - Visualização e busca
- ✅ **Sistema de Favoritos** - Adicionar/remover favoritos
- ✅ **Montador de Looks** - Criar combinações
- ✅ **Sugerir Looks** - IA para sugestões
- ✅ **Painel Administrativo** - CRUD completo
- ✅ **Sistema de Login** - Autenticação
- ✅ **Recuperação de Senha** - Email de reset

### Backend
- ✅ **API RESTful** - Endpoints completos
- ✅ **Autenticação** - Laravel Sanctum
- ✅ **Upload de Imagens** - Storage
- ✅ **Sistema de Filtros** - Busca avançada
- ✅ **Painel Admin** - Gerenciamento completo
- ✅ **Envio de Emails** - SMTP configurado

## 👥 Usuários Padrão

### Administrador
- **Email:** admin@brecho.com
- **Senha:** admin123
- **Role:** admin

### Usuário Comum
- **Email:** user@brecho.com
- **Senha:** user123
- **Role:** user

## 🐛 Solução de Problemas

### Erro de Conexão com Banco
```bash
# Verificar se PostgreSQL está rodando
sudo service postgresql status

# Criar banco se não existir
createdb tcc_brecho
```

### Erro de Dependências Frontend
```bash
# Limpar cache do npm
npm cache clean --force

# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

### Erro de Dependências Backend
```bash
# Limpar cache do composer
composer clear-cache

# Reinstalar dependências
rm -rf vendor composer.lock
composer install
```

### Erro de Permissões (Linux/Mac)
```bash
# Dar permissão de escrita
chmod -R 755 storage bootstrap/cache
```

## 📧 Configuração de Email

Para usar a funcionalidade de recuperação de senha:

1. **Ativar 2FA no Gmail**
2. **Gerar Senha de App:**
   - Acesse: https://myaccount.google.com/
   - Segurança → Verificação em duas etapas → Senhas de app
   - Digite "Laravel Mailer" e clique "Criar"
   - Copie a senha de 16 caracteres

3. **Configurar no .env:**
```env
MAIL_PASSWORD="sua_senha_de_16_caracteres"
```

## 🚀 Deploy

### Backend (Laravel)
```bash
# Configurar para produção
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Frontend (Angular)
```bash
# Build para produção
ng build --configuration production
```

## 📞 Suporte

Para dúvidas ou problemas:
- **Email:** jc.chiavelli@unesp.br
- **GitHub:** https://github.com/Jhou1607/tcc_brecho_backup

## 📄 Licença

Este projeto foi desenvolvido como Trabalho de Conclusão de Curso (TCC) na UNESP.

---

**Desenvolvido com ❤️ por Equipe - 5 TCC** 