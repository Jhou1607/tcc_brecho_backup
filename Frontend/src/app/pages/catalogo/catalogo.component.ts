import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faSolidHeart } from '@fortawesome/free-solid-svg-icons';
import { ProdutoService } from '../../services/product.service';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { CommonModule} from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import {PaginatedResponse, Product} from '../../interfaces/interfaces';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    FontAwesomeModule,
  ],
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.scss']
})
export class CatalogoComponent implements OnInit {
  faRegularHeart = faRegularHeart;
  faSolidHeart = faSolidHeart;
  produtos$: Observable<PaginatedResponse<Product>> | undefined;
  currentPage: number = 1;
  lastPage: number = 1;
  isLoading = false;
  error: string | null = null;

  constructor(
    private produtoService: ProdutoService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private notification: NzNotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.error = null;
    
    console.log('🔍 Iniciando carregamento de produtos...');
    console.log('🌐 API URL:', this.produtoService['apiUrl']);
    
    this.produtos$ = this.produtoService.getProdutos(undefined, this.currentPage).pipe(
      tap((response: PaginatedResponse<Product>) => {
        console.log('✅ Produtos carregados com sucesso:', response);
        this.currentPage = response.current_page;
        this.lastPage = response.last_page;
        this.isLoading = false;
      }),
      catchError(err => {
        console.error('❌ Erro ao carregar produtos:', err);
        console.error('❌ Status:', err.status);
        console.error('❌ Message:', err.message);
        console.error('❌ Error:', err.error);
        
        this.error = 'Não foi possível carregar os produtos. Tente novamente mais tarde.';
        this.isLoading = false;
        return of({ data: [], current_page: 1, last_page: 1, per_page: 8, total: 0, links: [] } as PaginatedResponse<Product>);
      })
    );
  }

  viewProduct(product: Product): void {
    console.log('Navegando para produto:', product.id, product.nome_produto);
    this.router.navigate(['/produto', product.id]);
  }

  toggleFavorite(product: Product, event: Event): void {
    event.stopPropagation();
    if (!product || product.id === undefined) {
      console.error('Produto ou ID do produto inválido para toggleFavorite.');
      return;
    }

    this.produtoService.toggleFavorite(product.id).subscribe({
      next: (res) => {
        product.is_favorited = res.status === 'added';
        this.notification.success('Favoritos', res.message);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.notification.error('Favoritos', 'Erro ao atualizar favoritos. Tente novamente.');
        console.error('Erro ao favoritar:', err);
      }
    });
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.lastPage && page !== this.currentPage) {
      this.currentPage = page;
      this.loadProducts();
    }
  }

  getImagemUrl(urlFromApi: string | undefined | null): SafeResourceUrl | string {
    const finalUrl = urlFromApi || 'assets/produtos/placeholder-product.png';
    if (urlFromApi && (urlFromApi.startsWith('http://') || urlFromApi.startsWith('https://'))) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(finalUrl);
    }
    return finalUrl;
  }
}
