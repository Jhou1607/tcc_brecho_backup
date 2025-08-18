# 🎨 LoopLook - Sistema de Moda com IA

Uma plataforma completa de moda que permite aos usuários cadastrar produtos, criar looks personalizados e utilizar inteligência artificial para geração e análise de looks.

## 🚀 Tecnologias

- **Backend**: Laravel 11.x (PHP 8.2+)
- **Frontend**: Angular 17.x (TypeScript)
- **Banco de Dados**: MySQL 8.0+
- **UI Framework**: Ng-Zorro Ant Design
- **IA**: Google Gemini API

## 📋 Funcionalidades

- ✅ Cadastro e gerenciamento de produtos
- ✅ Sistema de usuários e autenticação
- ✅ Criação de looks personalizados
- ✅ Geração de looks com IA
- ✅ Análise de looks com IA
- ✅ Sistema de favoritos
- ✅ Armários virtuais
- ✅ Interface administrativa
- ✅ Upload de imagens com remoção de fundo
- ✅ Recorte de imagens

## 🛠️ Instalação Rápida

### Pré-requisitos
- Node.js 18.x+
- PHP 8.2+
- MySQL 8.0+
- Composer
- Git

### Backend (Laravel)
```bash
cd Backend
composer install
cp .env.example .env
# Configure o arquivo .env com suas credenciais
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan serve
```

### Frontend (Angular)
```bash
cd Frontend
npm install
ng serve
```

## 📖 Documentação Completa

Para instruções detalhadas de instalação, configuração e troubleshooting, consulte o [MANUAL_INSTALACAO.md](MANUAL_INSTALACAO.md).

## 🌐 Acesso

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:8000

**Usuários de teste:**
- **Admin**: admin@looplook.com / admin123
- **Usuário**: user@looplook.com / user123

## 📁 Estrutura do Projeto

```
TCC OFICIAL/
├── Backend/          # API Laravel
├── Frontend/         # Aplicação Angular
├── MANUAL_INSTALACAO.md
└── README.md
```

## 🤝 Contribuição

Este é um projeto de TCC. Para dúvidas ou suporte, entre em contato com a equipe de desenvolvimento.

## 📄 Licença

Este projeto é parte de um trabalho de conclusão de curso. 