<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ResetPasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    public $token;
    public $email;

    public function __construct($token, $email)
    {
        $this->token = $token;
        $this->email = $email;
    }

    public function build()
    {
        return $this->subject('Recuperação de Senha - Brecho LoopLook')
                    ->view('emails.reset-password')
                    ->with([
                        'token' => $this->token,
                        'email' => $this->email,
                        'resetUrl' => env('FRONTEND_URL', 'http://localhost:4200') . '/reset-password?token=' . $this->token . '&email=' . $this->email
                    ]);
    }
} 