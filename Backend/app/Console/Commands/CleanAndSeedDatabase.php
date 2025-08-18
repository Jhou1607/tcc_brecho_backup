<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Artisan;

class CleanAndSeedDatabase extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:clean-and-seed';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Limpa o banco de dados e executa o seeder com produtos reais';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🧹 Iniciando limpeza do banco de dados...');

        // Desabilitar verificação de chaves estrangeiras
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // Limpar tabelas relacionadas a produtos
        $this->info('🗑️  Limpando tabelas de produtos...');
        
        DB::table('armarios')->truncate();
        $this->info('   ✅ Armários limpos');
        
        DB::table('produto_usuarios')->truncate();
        $this->info('   ✅ Produtos de usuários limpos');
        
        DB::table('imagens')->truncate();
        $this->info('   ✅ Imagens limpas');
        
        DB::table('produtos')->truncate();
        $this->info('   ✅ Produtos limpos');

        // Reabilitar verificação de chaves estrangeiras
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $this->info('✨ Banco limpo com sucesso!');

        // Executar o seeder
        $this->info('🌱 Executando seeder com produtos reais...');
        
        try {
            Artisan::call('db:seed', ['--class' => 'RealProdutoSeeder']);
            $this->info('✅ Seeder executado com sucesso!');
        } catch (\Exception $e) {
            $this->error('❌ Erro ao executar o seeder: ' . $e->getMessage());
            return 1;
        }

        $this->info('🎉 Processo concluído!');
        $this->info('');
        $this->info('📋 PRÓXIMOS PASSOS:');
        $this->info('1. Adicione as imagens dos produtos na pasta: storage/app/public/produtos/');
        $this->info('2. Execute: php artisan storage:link (se ainda não foi feito)');
        $this->info('3. As imagens devem ter os nomes exatos listados acima');
        
        return 0;
    }
}
