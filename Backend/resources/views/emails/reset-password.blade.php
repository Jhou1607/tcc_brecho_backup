<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Recuperação de Senha - Brecho LoopLook</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #9bad9a;
            margin-bottom: 10px;
        }
        .title {
            color: #385246;
            font-size: 20px;
            margin-bottom: 20px;
        }
        .content {
            margin-bottom: 30px;
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #9bad9a 0%, #8c624d 100%);
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 25px;
            font-weight: bold;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 14px;
        }
        .warning {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🛍️ Brecho LoopLook</div>
            <h1 class="title">Recuperação de Senha</h1>
        </div>
        
        <div class="content">
            <p>Olá!</p>
            
            <p>Recebemos uma solicitação para redefinir a senha da sua conta no <strong>Brecho LoopLook</strong>.</p>
            
            <p>Se você não fez essa solicitação, pode ignorar este email com segurança.</p>
            
            <div style="text-align: center;">
                <a href="{{ $resetUrl }}" class="button">
                    Redefinir Minha Senha
                </a>
            </div>
            
            <div class="warning">
                <strong>⚠️ Importante:</strong> Este link expira em 60 minutos por motivos de segurança.
            </div>
            
            <p>Se o botão não funcionar, copie e cole este link no seu navegador:</p>
            <p style="word-break: break-all; color: #666; font-size: 12px;">
                {{ $resetUrl }}
            </p>
        </div>
        
        <div class="footer">
            <p>Este email foi enviado automaticamente. Não responda a este email.</p>
            <p>© 2024 Brecho LoopLook. Todos os direitos reservados.</p>
        </div>
    </div>
</body>
</html> 