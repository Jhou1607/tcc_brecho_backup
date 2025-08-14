import { Component, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage, CurrencyPipe } from '@angular/common';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes, faSearch, faHeart } from '@fortawesome/free-solid-svg-icons';
import { ProdutoService } from '../../services/product.service';
import { Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import {PaginatedResponse, Product} from '../../interfaces/interfaces';
import { trigger, state, style, animate, transition } from '@angular/animations';


@Component({
  selector: 'app-pesquisa',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    FooterComponent,
    RouterModule,
    FormsModule,
    FontAwesomeModule,
    NgOptimizedImage

  ],
  templateUrl: './pesquisa.component.html',
  styleUrls: ['./pesquisa.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('in', style({ right: '0', opacity: 1 })),
      state('out', style({ right: '-400px', opacity: 0 })),
      transition('out => in', [animate('300ms cubic-bezier(.77,0,.18,1)')]),
      transition('in => out', [animate('200ms cubic-bezier(.77,0,.18,1)')]),
    ])
  ]
})
export class PesquisaComponent implements OnInit {
  searchTerm: string = '';
  trendingSearches: string[] = ['Bolsa', 'Tênis', 'Camisa'];
  products: Product[] = [];
  latestProducts: Product[] = []; // Últimos lançamentos
  totalResults = 0;
  currentPage: number = 1;
  lastPage: number = 1;
  isLoading = false;
  error: string | null = null;
  initialLoad = true;
  hasSearched = false; // Controla se já fez busca

  // Filtros dinâmicos
  filtrosDisponiveis: any = {};
  filterCategories: any[] = [];
  selectedFilters: { [key: string]: string[] } = {};
  accordionOpen: { [key: string]: boolean } = {};
  isFilterPanelOpen = false;

  faTimesSolid = faTimes;
  faSearchSolid = faSearch;
  faHeartSolid = faHeart;

  constructor(private router: Router, private produtoService: ProdutoService) {}

  ngOnInit(): void {
    this.buscarFiltros();
    this.buscarUltimosLancamentos(); // Carrega últimos lançamentos na inicialização
  }

  buscarFiltros() {
    this.produtoService.getFiltrosDisponiveis().subscribe({
      next: (filtros) => {
        this.filtrosDisponiveis = filtros;
        // Monta as categorias de filtro dinamicamente
        this.filterCategories = [
          { key: 'genero', label: 'Gênero', options: filtros.genero || [] },
          { key: 'numeracao', label: 'Numeração', options: filtros.numeracao || [] },
          { key: 'cor', label: 'Cor', options: filtros.cor || [] },
          { key: 'estado_conservacao', label: 'Estado de conservação', options: filtros.estado_conservacao || [] },
          { key: 'estacao', label: 'Estação', options: filtros.estacao || [] },
          { key: 'ocasioes', label: 'Ocasiões', options: filtros.ocasioes || [] },
          { key: 'estilos', label: 'Estilo', options: filtros.estilos || [] },
          { key: 'material', label: 'Material', options: filtros.material || [] },
          { key: 'categoria', label: 'Categorias', options: filtros.categoria || [] }
        ];
        // Inicializa filtros e accordions
        this.filterCategories.forEach(f => {
          if (!this.selectedFilters[f.key]) this.selectedFilters[f.key] = [];
          if (this.accordionOpen[f.key] === undefined) this.accordionOpen[f.key] = false;
        });
      },
      error: (err) => {
        console.error('Erro ao carregar filtros:', err);
      }
    });
  }

  buscarUltimosLancamentos() {
    // Busca os 10 produtos mais recentes para a seção "Últimos Lançamentos"
    this.produtoService.getProdutos('', 1, {}, 10).subscribe({
      next: (res) => {
        this.latestProducts = res.data.slice(0, 10); // Pega apenas 10 produtos
      },
      error: (err) => {
        console.error('Erro ao carregar últimos lançamentos:', err);
      }
    });
  }

  buscarProdutos(page: number = 1) {
    // Só busca se há termo de busca
    if (!this.searchTerm.trim()) {
      this.products = [];
      this.totalResults = 0;
      this.hasSearched = false;
      this.error = null;
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.hasSearched = true;
    
    this.produtoService.getProdutos(this.searchTerm.trim(), page, this.selectedFilters)
      .subscribe({
        next: (res) => {
          this.products = res.data;
          this.totalResults = res.total;
          this.currentPage = res.current_page;
          this.lastPage = res.last_page;
          this.isLoading = false;
          this.initialLoad = false;
        },
        error: (err) => {
          console.error('Erro na busca:', err);
          this.error = 'Erro ao buscar produtos. Tente novamente.';
          this.isLoading = false;
          this.products = [];
          this.totalResults = 0;
        }
      });
  }

  search(term: string): void {
    if (!term.trim()) {
      this.clearSearch();
      return;
    }
    this.searchTerm = term;
    this.currentPage = 1;
    this.buscarProdutos();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.currentPage = 1;
    this.hasSearched = false;
    this.products = [];
    this.totalResults = 0;
    this.error = null;
  }

  clickTrendingSearch(term: string): void {
    this.searchTerm = term;
    this.currentPage = 1;
    this.buscarProdutos();
  }

  closeSearchPage(): void {
    window.history.back();
  }

  toggleFavorite(productId: number, event: Event): void {
    event.stopPropagation();
    
    // Encontra o produto na lista de produtos
    const product = this.products.find(p => p.id === productId) || 
                   this.latestProducts.find(p => p.id === productId);
    
    if (product) {
      this.produtoService.toggleFavorite(productId).subscribe({
        next: () => {
          // Atualiza o estado do favorito
          product.is_favorited = !product.is_favorited;
          
          // Adiciona animação visual
          const button = event.target as HTMLElement;
          if (product.is_favorited) {
            button.classList.add('favorited');
            button.style.animation = 'pulse 0.3s ease-out';
          } else {
            button.classList.remove('favorited');
          }
        },
        error: (err) => {
          console.error('Erro ao favoritar produto:', err);
        }
      });
    }
  }

  goToProductDetail(productId: number): void {
    this.router.navigate(['/produto', productId]);
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.buscarProdutos(page);
  }

  getImagemUrl(path: string): string {
    return `${path}`;
  }

  getCheckboxChecked(event: Event): boolean {
    return (event.target && (event.target as HTMLInputElement).checked) || false;
  }

  // Filtros
  toggleFilterPanel() {
    this.isFilterPanelOpen = !this.isFilterPanelOpen;
  }

  toggleAccordion(key: string) {
    const currentState = this.accordionOpen[key];
    Object.keys(this.accordionOpen).forEach(k => {
      this.accordionOpen[k] = false;
    });
    this.accordionOpen[key] = !currentState;
  }

  onFilterChange(key: string, value: string, checked: boolean) {
    if (checked) {
      if (!this.selectedFilters[key].includes(value)) {
        this.selectedFilters[key].push(value);
      }
    } else {
      this.selectedFilters[key] = this.selectedFilters[key].filter(v => v !== value);
    }
  }

  applyFilters() {
    this.isFilterPanelOpen = false;
    this.currentPage = 1;
    this.buscarProdutos();
  }

  clearFilters() {
    Object.keys(this.selectedFilters).forEach(key => this.selectedFilters[key] = []);
    this.buscarProdutos();
  }
}
