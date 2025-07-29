import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProdutoService } from '../../services/product.service';
import { Product } from '../../interfaces/interfaces';

interface Peca {
  id: number;
  nome: string;
  image_url: string;
  origem: 'usuario' | 'loja';
  categoria: string;
  tipo?: string;
  ocasioes?: string[];
  estilos?: string[];
  estacao?: string;
  cor?: string;
  material?: string;
}

@Component({
  selector: 'app-selecionar-peca-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './selecionar-peca-modal.component.html',
  styleUrls: ['./selecionar-peca-modal.component.scss']
})
export class SelecionarPecaModalComponent implements OnInit {
  @Input() aberto = false;
  @Output() fechar = new EventEmitter<void>();
  @Output() selecionar = new EventEmitter<Peca>();
  @Output() pecasUsuarioLoaded = new EventEmitter<Peca[]>();
  @Output() pecasLojaLoaded = new EventEmitter<Peca[]>();

  abaAtiva: 'usuario' | 'loja' = 'usuario';
  pesquisa = '';

  pecasUsuario: Peca[] = [];
  pecasLoja: Peca[] = [];
  carregandoUsuario = false;
  carregandoLoja = false;
  
  // Cache para evitar recarregar dados
  private cachePecasUsuario: Peca[] = [];
  private cachePecasLoja: Peca[] = [];
  private usuarioCarregado = false;
  private lojaCarregada = false;

  constructor(private produtoService: ProdutoService) {}

  ngOnInit() {
    this.buscarPecasUsuario();
    this.buscarPecasLoja();
  }

  buscarPecasUsuario() {
    // Usar cache se já carregado
    if (this.usuarioCarregado && this.cachePecasUsuario.length > 0) {
      this.pecasUsuario = [...this.cachePecasUsuario];
      this.pecasUsuarioLoaded.emit(this.pecasUsuario);
      return;
    }

    this.carregandoUsuario = true;
    console.log('Iniciando busca de peças do usuário...');
    this.produtoService.getAllProdutosUsuario().subscribe({
      next: (produtos: Product[]) => {
        console.log('Produtos usuário recebidos:', produtos.length);
        
        this.pecasUsuario = produtos.map(p => ({
          id: p.id,
          nome: p.nome_produto,
          image_url: p.image_url || 'assets/produtos/placeholder-product.png',
          origem: 'usuario',
          categoria: p.categoria || '',
          tipo: p.categoria || '',
          ocasioes: p.ocasioes,
          estilos: p.estilos,
          estacao: p.estacao,
          cor: p.cor,
          material: p.material
        }));
        
        // Salvar no cache
        this.cachePecasUsuario = [...this.pecasUsuario];
        this.usuarioCarregado = true;
        
        this.carregandoUsuario = false;
        console.log('Pecas usuario mapeadas:', this.pecasUsuario.length);
        this.pecasUsuarioLoaded.emit(this.pecasUsuario);
      },
      error: (err) => { 
        console.error('Erro ao buscar peças usuário:', err);
        this.carregandoUsuario = false; 
      }
    });
  }

  buscarPecasLoja() {
    // Usar cache se já carregado
    if (this.lojaCarregada && this.cachePecasLoja.length > 0) {
      this.pecasLoja = [...this.cachePecasLoja];
      this.pecasLojaLoaded.emit(this.pecasLoja);
      return;
    }

    this.carregandoLoja = true;
    console.log('Iniciando busca de peças da loja...');
    
    // Carregar todos os produtos de uma vez com per_page alto
    this.produtoService.getProdutos(undefined, 1, {}, 100).subscribe({
      next: (res) => {
        console.log('Resposta da API da loja:', res);
        const pecasLoja = res.data.map((p: Product) => ({
          id: p.id,
          nome: p.nome_produto,
          image_url: p.image_url || 'assets/produtos/placeholder-product.png',
          origem: 'loja' as 'loja',
          categoria: p.categoria || '',
          tipo: p.categoria || '',
          ocasioes: p.ocasioes,
          estilos: p.estilos,
          estacao: p.estacao,
          cor: p.cor,
          material: p.material
        }));
        
        this.pecasLoja = pecasLoja;
        this.cachePecasLoja = [...pecasLoja];
        this.lojaCarregada = true;
        this.carregandoLoja = false;
        console.log('Pecas loja carregadas:', this.pecasLoja.length);
        console.log('Categorias disponíveis na loja:', [...new Set(this.pecasLoja.map(p => p.categoria))]);
        this.pecasLojaLoaded.emit(this.pecasLoja);
      },
      error: (err) => {
        console.error('Erro ao buscar peças loja:', err);
        this.carregandoLoja = false;
      }
    });
  }

  get pecasFiltradas() {
    const lista = this.abaAtiva === 'usuario' ? this.pecasUsuario : this.pecasLoja;
    const filtradas = lista.filter(p =>
      p.nome.toLowerCase().includes(this.pesquisa.toLowerCase())
    );
    console.log(`Pecas filtradas (${this.abaAtiva}):`, filtradas.length, 'de', lista.length);
    return filtradas;
  }

  trocarAba(aba: 'usuario' | 'loja') {
    this.abaAtiva = aba;
    this.pesquisa = '';
  }

  selecionarPeca(peca: Peca) {
    this.selecionar.emit(peca);
  }

  fecharModal() {
    this.fechar.emit();
  }
} 