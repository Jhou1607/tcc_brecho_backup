import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { ProdutoService} from '../../services/product.service';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import {PaginatedResponse, Product} from '../../interfaces/interfaces';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, FontAwesomeModule],
  templateUrl: './favoritos.component.html',
  styleUrls: ['./favoritos.component.scss']
})
export class FavoritosComponent implements OnInit {
  faSolidHeart = faHeart;
  favoritos$: Observable<PaginatedResponse<Product>> | undefined;
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
  ) { }

  ngOnInit(): void {
    this.loadFavoritos();
  }

  loadFavoritos(): void {
    this.isLoading = true;
    this.error = null;
    this.favoritos$ = this.produtoService.getFavoritos(this.currentPage).pipe(
      tap((response: PaginatedResponse<Product>) => {
        this.currentPage = response.current_page;
        this.lastPage = response.last_page;
        this.isLoading = false;
      }),
      catchError(err => {
        this.error = 'Não foi possível carregar os favoritos. Tente fazer o login novamente.';
        this.isLoading = false;
        console.error('Erro ao carregar favoritos:', err);
        return of({ data: [], current_page: 1, last_page: 1, per_page: 8, total: 0, links: [] } as PaginatedResponse<Product>);
      })
    );
  }

  viewProduct(product: Product): void {
    this.router.navigate(['/produto', product.id]);
  }

  // Ao desfavoritar um item na página de favoritos, ele deve sumir da lista
  toggleFavorite(product: Product, event: Event): void {
    event.stopPropagation();
    if (!product || product.id === undefined) {
      return;
    }

    this.produtoService.toggleFavorite(product.id).subscribe({
      next: (res) => {
        this.notification.success('Favoritos', res.message);
        // Recarrega a lista para remover o item desfavoritado
        this.loadFavoritos();
      },
      error: (err) => {
        this.notification.error('Favoritos', 'Erro ao atualizar favoritos.');
        console.error('Erro ao desfavoritar:', err);
      }
    });
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.lastPage && page !== this.currentPage) {
      this.currentPage = page;
      this.loadFavoritos();
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
