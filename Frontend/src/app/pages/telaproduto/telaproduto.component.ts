import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { ProdutoService } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, Subject, Observable } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faSolidHeart, faSearchPlus, faSearchMinus, faSearch, faTimes, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalService, NzModalModule } from 'ng-zorro-antd/modal';
import {Product} from '../../interfaces/interfaces';

@Component({
  selector: 'app-telaproduto',
  templateUrl: './telaproduto.component.html',
  styleUrls: ['./telaproduto.component.scss'],
  standalone: true,
  imports: [CommonModule, CurrencyPipe, HeaderComponent, FooterComponent, FontAwesomeModule, NzModalModule]
})
export class TelaprodutoComponent implements OnInit, OnDestroy {
  @ViewChild('modalImageWrapper') modalImageWrapperRef!: ElementRef<HTMLDivElement>;
  @ViewChild('modalImageZoomable') modalImageZoomableRef!: ElementRef<HTMLImageElement>;
  @ViewChild('modalContent') modalContentRef!: ElementRef<HTMLDivElement>;

  pageMode: 'catalogo' | 'armario' = 'catalogo';
  product: Product | null = null;
  selectedImage: string | undefined | null;
  isLoading = false;
  error: string | null = null;

  faRegularHeart = faRegularHeart;
  faSolidHeart = faSolidHeart;
  faSearchPlus = faSearchPlus;
  faSearchMinus = faSearchMinus;
  faSearch = faSearch;
  faTimes = faTimes;
  faTrash = faTrash;
  faEdit = faEdit;

  isModalOpen = false;
  modalImageUrl: string | undefined | null = '';
  currentZoomLevel = 1;
  minZoomLevel = 1.0;
  maxZoomLevel = 3.0;
  zoomStep = 0.2;
  isPanning = false;
  panStartX = 0;
  panStartY = 0;
  panX = 0;
  panY = 0;
  transformOrigin = 'center center';
  private imageNaturalWidth = 0;
  private imageNaturalHeight = 0;
  private destroy$ = new Subject<void>();

  constructor(
    private produtoService: ProdutoService,
    private route: ActivatedRoute,
    private router: Router,
    private notification: NzNotificationService,
    private modalService: NzModalService
  ) {}

  ngOnInit(): void {
    this.route.data.pipe(
      takeUntil(this.destroy$),
      tap(data => {
        this.pageMode = data['pageMode'] || 'catalogo';
      }),
      switchMap(() => this.route.paramMap)
    ).subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadProduct(id);
      } else {
        this.isLoading = false;
        this.error = 'ID do produto não fornecido na rota.';
      }
    });
  }

  loadProduct(id: string): void {
    this.isLoading = true;
    this.error = null;
    this.product = null;

    const productObservable: Observable<Product> = this.pageMode === 'catalogo'
      ? this.produtoService.getProdutoById(id)
      : this.produtoService.getProdutoUsuarioById(id);

    productObservable.pipe(
      takeUntil(this.destroy$),
      catchError(_err => {
        this.isLoading = false;
        this.error = this.pageMode === 'catalogo'
          ? 'Produto não encontrado ou erro ao carregar.'
          : 'Peça não encontrada ou não autorizada.';
        return of(null);
      })
    ).subscribe(productResponse => {
      this.isLoading = false;
      if (productResponse) {
        this.product = productResponse;
        if (this.product && this.product.images && this.product.images.length > 0) {
          const principalImage = this.product.images.find(img => img.is_principal) || this.product.images[0];
          this.selectedImage = principalImage.url;
        } else if (this.product) {
          this.selectedImage = 'assets/produtos/placeholder-product.png';
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.isModalOpen) {
      document.body.style.overflow = '';
    }
  }

  selectImage(imageUrl: string | undefined | null): void {
    this.selectedImage = this.getImagemUrl(imageUrl);
  }

  getImagemUrl(urlFromApi: string | undefined | null): string {
    return urlFromApi || 'assets/produtos/placeholder-product.png';
  }

  toggleProductFavorite(): void {
    if (!this.product?.id) return;
    this.produtoService.toggleFavorite(this.product.id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        if (this.product) {
          this.product.is_favorited = res.status === 'added';
        }
        this.notification.success('Favoritos', res.message);
      },
      error: (_err) => {
        this.notification.error('Favoritos', 'Erro ao atualizar favoritos. Tente novamente.');
      }
    });
  }

  deleteProduto(): void {
    if (!this.product?.id) return;
    const productId = this.product.id;

    this.modalService.confirm({
      nzTitle: 'Você tem certeza que quer remover esta peça?',
      nzContent: 'Esta ação é permanente.',
      nzOkText: 'Sim, remover',
      nzOkDanger: true,
      nzOnOk: () =>
        this.produtoService.deleteProdutoUsuario(productId).subscribe({
          next: (res) => {
            this.notification.success('Sucesso', res.message);
            this.router.navigate(['/armario']).catch(()=>{});
          },
          error: (err) => {
            this.notification.error('Erro', err.error?.message || 'Não foi possível remover a peça.');
          }
        }),
      nzCancelText: 'Cancelar'
    });
  }

  async openImageModal(imageUrl: string | undefined | null): Promise<void> {
    if (!imageUrl) return;
    this.modalImageUrl = imageUrl;
    try {
      const dimensions = await this.getImageDimensions(imageUrl);
      this.imageNaturalWidth = dimensions.width;
      this.imageNaturalHeight = dimensions.height;
    } catch (e) {
      this.imageNaturalWidth = 0;
      this.imageNaturalHeight = 0;
    }
    this.isModalOpen = true;
    this.resetZoomAndPan();
    document.body.style.overflow = 'hidden';
  }

  closeImageModal(): void {
    this.isModalOpen = false;
    document.body.style.overflow = '';
  }

  private getImageDimensions(url: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = reject;
      img.src = url;
    });
  }

  private applyZoom(newZoomLevel: number, mouseClientX?: number, mouseClientY?: number): void {
    if (!this.modalImageWrapperRef || !this.modalImageZoomableRef || !this.imageNaturalWidth) return;
    const oldZoomLevel = this.currentZoomLevel;
    this.currentZoomLevel = Math.max(this.minZoomLevel, Math.min(this.maxZoomLevel, newZoomLevel));

    if (this.currentZoomLevel <= 1) {
      this.resetZoomAndPan(false);
      this.transformOrigin = 'center center';
      return;
    }

    const imageEl = this.modalImageZoomableRef.nativeElement;
    const wrapperRect = this.modalImageWrapperRef.nativeElement.getBoundingClientRect();
    const targetX = mouseClientX !== undefined ? mouseClientX : wrapperRect.left + wrapperRect.width / 2;
    const targetY = mouseClientY !== undefined ? mouseClientY : wrapperRect.top + wrapperRect.height / 2;
    const imageRect = imageEl.getBoundingClientRect();
    const mouseXOnScaledImage = targetX - imageRect.left;
    const mouseYOnScaledImage = targetY - imageRect.top;
    const imagePointX = mouseXOnScaledImage / oldZoomLevel;
    const imagePointY = mouseYOnScaledImage / oldZoomLevel;

    this.transformOrigin = `${imagePointX}px ${imagePointY}px`;
    this.panX = (targetX - wrapperRect.left) - (imagePointX * this.currentZoomLevel);
    this.panY = (targetY - wrapperRect.top) - (imagePointY * this.currentZoomLevel);

    this.constrainPan();
  }

  zoomIn(event?: MouseEvent): void {
    this.applyZoom(this.currentZoomLevel + this.zoomStep, event?.clientX, event?.clientY);
  }

  zoomOut(event?: MouseEvent): void {
    this.applyZoom(this.currentZoomLevel - this.zoomStep, event?.clientX, event?.clientY);
  }

  resetZoom(): void {
    this.resetZoomAndPan();
  }

  private resetZoomAndPan(resetZoomLevel = true): void {
    if (resetZoomLevel) {
      this.currentZoomLevel = 1;
    }
    this.panX = 0;
    this.panY = 0;
    this.transformOrigin = 'center center';
  }

  onWheelZoom(event: WheelEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const delta = event.deltaY > 0 ? -this.zoomStep : this.zoomStep;
    this.applyZoom(this.currentZoomLevel + delta, event.clientX, event.clientY);
  }

  startPan(event: MouseEvent): void {
    if (this.currentZoomLevel <= 1) return;
    event.preventDefault();
    this.isPanning = true;
    this.panStartX = event.clientX - this.panX;
    this.panStartY = event.clientY - this.panY;
  }

  panImage(event: MouseEvent): void {
    if (!this.isPanning || this.currentZoomLevel <= 1) return;
    event.preventDefault();
    this.panX = event.clientX - this.panStartX;
    this.panY = event.clientY - this.panStartY;
    this.constrainPan();
  }

  endPan(): void {
    this.isPanning = false;
  }

  private constrainPan(): void {
    if (!this.modalImageWrapperRef || !this.modalImageZoomableRef || this.currentZoomLevel <=1 || !this.imageNaturalWidth) return;

    const scaledWidth = this.imageNaturalWidth * this.currentZoomLevel;
    const scaledHeight = this.imageNaturalHeight * this.currentZoomLevel;
    const wrapperWidth = this.modalImageWrapperRef.nativeElement.clientWidth;
    const wrapperHeight = this.modalImageWrapperRef.nativeElement.clientHeight;

    let minPanX = 0, maxPanX = 0, minPanY = 0, maxPanY = 0;

    if (scaledWidth > wrapperWidth) {
      minPanX = wrapperWidth - scaledWidth;
      maxPanX = 0;
    }
    if (scaledHeight > wrapperHeight) {
      minPanY = wrapperHeight - scaledHeight;
      maxPanY = 0;
    }

    if (this.transformOrigin !== 'center center') {
      const originX = parseFloat(this.transformOrigin.split(' ')[0]);
      const originY = parseFloat(this.transformOrigin.split(' ')[1]);
      if (scaledWidth > wrapperWidth) {
        maxPanX = originX * (this.currentZoomLevel - 1);
        minPanX = maxPanX - (scaledWidth - wrapperWidth);
      }
      if (scaledHeight > wrapperHeight) {
        maxPanY = originY * (this.currentZoomLevel - 1);
        minPanY = maxPanY - (scaledHeight - wrapperHeight);
      }
    }

    this.panX = Math.max(minPanX, Math.min(maxPanX, this.panX));
    this.panY = Math.max(minPanY, Math.min(maxPanY, this.panY));
  }

  @HostListener('document:keydown.escape', ['$event'])
  onKeydownHandler(_event: KeyboardEvent) {
    if (this.isModalOpen) {
      this.closeImageModal();
    }
  }
}
