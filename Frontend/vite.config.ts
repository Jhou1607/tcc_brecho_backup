import { defineConfig } from 'vite';
import { angular } from '@angular-devkit/build-angular/plugins/vite';

// Permite acesso via domínios do ngrok no dev-server (Angular + Vite)
export default defineConfig({
  plugins: [angular()],
  server: {
    host: true, // expõe em 0.0.0.0
    allowedHosts: [
      /.*\.ngrok-free\.app$/i, // qualquer subdomínio do ngrok
      'localhost',
      '127.0.0.1',
      '10.209.75.214'
    ]
  }
});


