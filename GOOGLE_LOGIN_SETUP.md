# Configuração do Login do Google

## Problema Atual
O erro `origin_mismatch` indica que a origem `localhost:31228` não está autorizada no Google Cloud Console para o OAuth 2.0 Client ID.

## Solução

### 1. Acessar Google Cloud Console
- Vá para [Google Cloud Console](https://console.cloud.google.com/)
- Selecione o projeto: `754445728495-c7tv7l3u4oi0budv5ju6n32peatus6dk.apps.googleusercontent.com`

### 2. Configurar OAuth 2.0
- No menu lateral, vá para **APIs & Services** > **Credentials**
- Clique no OAuth 2.0 Client ID existente
- Na seção **Authorized JavaScript origins**, adicione:
  ```
  http://localhost:31228
  http://localhost:4200
  http://localhost:3000
  ```

### 3. Configurações Adicionais
- **Authorized redirect URIs**: (deixe vazio para este tipo de aplicação)
- **Application type**: Web application

### 4. Salvar e Testar
- Clique em **Save**
- Aguarde alguns minutos para as mudanças propagarem
- Teste o login do Google novamente

## Alternativa Temporária
Se não conseguir acessar o Google Cloud Console, você pode:

1. Usar a porta 4200 que já está funcionando
2. Ou modificar o `environment.ts` para usar a porta 4200:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api'
};
```

## Notas Importantes
- O Google pode levar alguns minutos para propagar as mudanças
- Certifique-se de que a origem inclui o protocolo (http://)
- Para produção, adicione o domínio real do seu site
