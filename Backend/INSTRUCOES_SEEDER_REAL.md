# 🧹 Instruções para Limpar e Recriar o Banco de Dados

## 📋 O que foi feito:

✅ **Removidos os seeders ruins:**
- `ProdutoSeeder.php` (produtos genéricos com dados fake)
- `ProdutoUsuarioSeeder.php` (produtos de usuário genéricos)
- `ArmarioSeeder.php` (armários com dados ruins)
- `ImagemSeeder.php` (imagens genéricas)

✅ **Criado novo seeder real:**
- `RealProdutoSeeder.php` (15 produtos reais de roupas)
- Dados consistentes e realistas
- Imagens correspondentes para cada produto

✅ **Comando personalizado criado:**
- `CleanAndSeedDatabase` para limpar e recriar o banco

## 🚀 Como usar:

### 1. **Limpar e Recriar o Banco:**
```bash
cd Backend
php artisan db:clean-and-seed
```

### 2. **Adicionar as Imagens dos Produtos:**
Crie a pasta e adicione as imagens:
```bash
mkdir -p storage/app/public/produtos
```

**Imagens necessárias:**
- `camiseta-basica-branca.jpg`
- `blusa-seda-estampada.jpg`
- `camisa-social-linho.jpg`
- `jaqueta-jeans-vintage.jpg`
- `sueter-la-tricotado.jpg`
- `calca-jeans-skinny.jpg`
- `saia-midi-plissada.jpg`
- `short-jeans-desbotado.jpg`
- `tenis-converse-allstar.jpg`
- `sandalia-rasteira-couro.jpg`
- `bolsa-couro-crossbody.jpg`
- `cinto-couro-marrom.jpg`
- `chapeu-palha-natural.jpg`
- `bone-baseball-vintage.jpg`

### 3. **Criar Link Simbólico (se necessário):**
```bash
php artisan storage:link
```

## 📊 Produtos Criados:

### **TOPS (5 produtos):**
- Camiseta Básica de Algodão - R$ 45,00
- Blusa de Seda Estampada - R$ 75,00
- Camisa Social de Linho - R$ 120,00
- Jaqueta Jeans Vintage - R$ 95,00
- Suéter de Lã Tricotado - R$ 85,00

### **CALÇAS E SAIAS (3 produtos):**
- Calça Jeans Skinny - R$ 65,00
- Saia Midi Plissada - R$ 55,00
- Short Jeans Desbotado - R$ 45,00

### **CALÇADOS (2 produtos):**
- Tênis Converse All Star - R$ 120,00
- Sandália Rasteira de Couro - R$ 35,00

### **ACESSÓRIOS (2 produtos):**
- Bolsa de Couro Crossbody - R$ 65,00
- Cinto de Couro Marrom - R$ 25,00

### **ACESSÓRIOS DE CABEÇA (2 produtos):**
- Chapéu de Palha Natural - R$ 40,00
- Boné Baseball Vintage - R$ 30,00

## 🎯 Características dos Produtos:

- **Preços realistas** para um brechó
- **Marcas conhecidas** (C&A, Renner, Riachuelo, Converse)
- **Marcas genéricas** (Brechó) para itens sem marca específica
- **Estados de conservação** variados (novo, seminovo, usado)
- **Categorias consistentes** com o sistema
- **Materiais reais** (algodão, seda, linho, jeans, couro, etc.)
- **Ocasiões e estilos** bem definidos

## 🔄 Para Adicionar Mais Produtos:

1. **Edite o arquivo:** `database/seeders/RealProdutoSeeder.php`
2. **Adicione novos produtos** no array `$produtos`
3. **Execute novamente:** `php artisan db:clean-and-seed`

## ⚠️ **IMPORTANTE:**

- **Sempre faça backup** do banco antes de executar
- **As imagens devem ter nomes exatos** listados acima
- **Execute o comando** apenas quando quiser limpar e recriar
- **Para desenvolvimento**, pode executar várias vezes

## 🎉 Resultado:

Após executar, você terá:
- ✅ Banco limpo de dados ruins
- ✅ 15 produtos reais de roupas
- ✅ Imagens correspondentes
- ✅ Dados consistentes e realistas
- ✅ Sistema pronto para uso profissional
