import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { ProdutoService } from '../../services/product.service';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
// 1. Importe o NzModalModule e o NzModalService
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import {PaginatedResponse, Product} from '../../interfaces/interfaces';


@Component({
  selector: 'app-armario',
  standalone: true,
  // 2. Adicione o NzModalModule ao array de imports
  imports: [CommonModule, HeaderComponent, FooterComponent, FontAwesomeModule, NzModalModule],
  templateUrl: './armario.component.html',
  styleUrls: ['./armario.component.scss']
})
export class ArmarioComponent implements OnInit {
  faTimes = faTimes;
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
    private modalService: NzModalService // A injeção de dependência agora funcionará
  ) { }

  ngOnInit(): void {
    this.loadProdutosUsuario();
  }

  loadProdutosUsuario(): void {
    this.isLoading = true;
    this.error = null;
    this.produtos$ = this.produtoService.getProdutosUsuario(this.currentPage).pipe(
      tap((response: PaginatedResponse<Product>) => {
        this.currentPage = response.current_page;
        this.lastPage = response.last_page;
        this.isLoading = false;
      }),
      catchError(err => {
        this.error = 'Não foi possível carregar seu armário. Tente fazer o login novamente.';
        this.isLoading = false;
        console.error('Erro ao carregar armário:', err);
        return of({ data: [], current_page: 1, last_page: 1, per_page: 8, total: 0, links: [] } as PaginatedResponse<Product>);
      })
    );
  }

  viewProduct(product: Product): void {
    // Atualize esta linha para apontar para a nova rota de detalhes da peça do usuário
    this.router.navigate(['/peca-usuario', product.id]);
  }

  deleteProduto(produtoId: number, event: Event): void {
    event.stopPropagation();

    this.modalService.confirm({
      nzTitle: 'Você tem certeza?',
      nzContent: 'Esta ação não pode ser desfeita e a peça será removida permanentemente do seu armário.',
      nzOkText: 'Sim, remover',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.produtoService.deleteProdutoUsuario(produtoId).subscribe({
          next: (res) => {
            this.notification.success('Sucesso', res.message);
            this.loadProdutosUsuario();
          },
          error: (err) => {
            this.notification.error('Erro', err.error.message || 'Não foi possível remover a peça.');
          }
        });
      },
      nzCancelText: 'Cancelar'
    });
  }

  adicionarNovaPeca(): void {
    this.router.navigate(['/usuario/produtos/cadastro-usr']);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.lastPage && page !== this.currentPage) {
      this.currentPage = page;
      this.loadProdutosUsuario();
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
