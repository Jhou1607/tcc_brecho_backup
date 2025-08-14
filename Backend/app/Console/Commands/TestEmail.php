<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class TestEmail extends Command
{
    protected $signature = 'email:test {email}';
    protected $description = 'Teste de envio de email';

    public function handle()
    {
        $email = $this->argument('email');
        
        try {
            Mail::raw('Teste de email do Brecho LoopLook!', function ($message) use ($email) {
                $message->to($email)
                        ->subject('Teste de Email - Brecho LoopLook');
            });
            
            $this->info("Email enviado com sucesso para: {$email}");
        } catch (\Exception $e) {
            $this->error("Erro ao enviar email: " . $e->getMessage());
        }
    }
} 