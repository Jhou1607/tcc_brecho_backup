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
