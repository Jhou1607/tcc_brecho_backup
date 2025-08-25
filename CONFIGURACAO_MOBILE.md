# 📱 **Configuração para Acesso Mobile**

## 🎯 **Objetivo**
Configurar o sistema para funcionar no celular através da rede WiFi local, mantendo a funcionalidade no PC intacta.

## 🚀 **Passo a Passo**

### **1. Descobrir o IP do seu PC na rede**

#### **Windows:**
```bash
ipconfig
```
Procure por "IPv4 Address" na sua rede WiFi (geralmente começa com 192.168.x.x)

#### **Linux/Mac:**
```bash
ifconfig
# ou
ip addr
```

### **2. Configurar o Backend (Laravel)**

#### **Opção A: Comando direto**
```bash
cd Backend
php artisan serve --host=0.0.0.0 --port=8000
```

#### **Opção B: Usando o script**
```bash
cd Backend
setup-mobile.bat
```

### **3. Configurar o Frontend (Angular)**

#### **Opção A: Comando direto**
```bash
cd Frontend
ng serve --host=0.0.0.0 --port=4200
```

#### **Opção B: Usando o script**
```bash
cd Frontend
setup-mobile.bat
```

### **4. Acessar no Celular**

1. **Conecte o celular na mesma rede WiFi do PC**
2. **Abra o navegador no celular**
3. **Acesse:** `http://SEU_IP:4200`

## 🔧 **Configurações Específicas**

### **Backend (.env)**
```env
APP_URL=http://0.0.0.0:8000
APP_DEBUG=true
CORS_ALLOWED_ORIGINS=*
```

### **Frontend (environment.ts)**
```typescript
export const environment = { 
  production: false, 
  apiUrl: 'http://SEU_IP:8000/api', 
  imageBaseUrl: 'http://SEU_IP:8000', 
  geminiApiKey: 'sua_chave_aqui' 
};
```

## ⚠️ **Importante**

### **Firewall**
- **Windows:** Permitir conexões nas portas 8000 e 4200
- **Linux:** Configurar iptables se necessário
- **Mac:** Configurar firewall nas preferências

### **Rede**
- **Mesma rede WiFi:** PC e celular devem estar na mesma rede
- **IP estático:** Considere configurar IP estático no PC para facilitar

### **Segurança**
- **Desenvolvimento apenas:** Esta configuração é para desenvolvimento
- **Não usar em produção:** Em produção, use HTTPS e configurações seguras

## 🚨 **Solução de Problemas**

### **Erro: "Connection refused"**
- Verifique se o firewall está permitindo as conexões
- Confirme se os serviços estão rodando nas portas corretas

### **Erro: "Cannot connect to host"**
- Verifique se o IP está correto
- Confirme se PC e celular estão na mesma rede

### **Erro: "CORS policy"**
- Verifique se o CORS está configurado corretamente no Laravel
- Confirme se as origens estão permitidas

## 📋 **Comandos Rápidos**

### **Iniciar Backend Mobile:**
```bash
cd Backend
php artisan serve --host=0.0.0.0 --port=8000
```

### **Iniciar Frontend Mobile:**
```bash
cd Frontend
ng serve --host=0.0.0.0 --port=4200
```

### **Verificar IP:**
```bash
# Windows
ipconfig

# Linux/Mac
ifconfig
```

## 🎉 **Resultado**

Após configurar:
- ✅ **PC:** Acessa em `http://localhost:4200` e `http://localhost:8000`
- ✅ **Celular:** Acessa em `http://SEU_IP:4200` e `http://SEU_IP:8000`
- ✅ **Banco de dados:** Funciona em ambos os dispositivos
- ✅ **API:** Acessível de qualquer dispositivo na rede

## 🔄 **Voltando ao Normal**

Para voltar ao funcionamento local apenas:

### **Backend:**
```bash
php artisan serve
```

### **Frontend:**
```bash
ng serve
```

## 📱 **Teste no Celular**

1. **Abra o navegador**
2. **Digite:** `http://SEU_IP:4200`
3. **Teste as funcionalidades:**
   - Login/Registro
   - Catálogo de produtos
   - Cadastro de produtos
   - Todas as funcionalidades do sistema

## 🎯 **Dicas**

- **Use o mesmo navegador** no PC e celular para facilitar
- **Mantenha o console aberto** para ver possíveis erros
- **Teste primeiro no PC** para garantir que está funcionando
- **Use IP estático** no PC para facilitar o acesso


