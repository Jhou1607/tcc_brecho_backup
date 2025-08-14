import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageOptimizerService } from '../../services/image-optimizer.service';

@Component({
  selector: 'app-lazy-image',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="lazy-image-container" [class.loaded]="isLoaded" [class.error]="hasError">
      <img 
        #imageElement
        [src]="currentSrc" 
        [alt]="alt"
        [class.hidden]="!isLoaded"
        (load)="onImageLoad()"
        (error)="onImageError()"
        class="lazy-image"
      />
      <div *ngIf="!isLoaded && !hasError" class="skeleton-placeholder">
        <div class="skeleton"></div>
      </div>
      <div *ngIf="hasError" class="error-placeholder">
        <span>Erro ao carregar imagem</span>
      </div>
    </div>
  `,
  styles: [`
    .lazy-image-container {
      position: relative;
      width: 100%;
      height: 100%;
      min-height: 100px;
    }
    
    .lazy-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: opacity 0.3s ease-in-out;
      
      &.hidden {
        opacity: 0;
      }
    }
    
    .lazy-image-container.loaded .lazy-image {
      opacity: 1;
    }
    
    .skeleton-placeholder {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #f0f0f0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .skeleton {
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
    }
    
    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    
    .error-placeholder {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #999;
      font-size: 12px;
      text-align: center;
    }
  `]
})
export class LazyImageComponent implements OnInit {
  @Input() src: string = '';
  @Input() alt: string = '';
  @Input() placeholder: string = '';
  
  @ViewChild('imageElement') imageElement!: ElementRef<HTMLImageElement>;
  
  currentSrc: string = '';
  isLoaded = false;
  hasError = false;

  constructor(private imageOptimizer: ImageOptimizerService) {}

  ngOnInit(): void {
    this.loadImage();
  }

  private loadImage(): void {
    if (!this.src) {
      this.hasError = true;
      return;
    }

    // Se a imagem já está em cache, carrega diretamente
    if (this.imageOptimizer.isImageCached(this.src)) {
      this.currentSrc = this.src;
      this.isLoaded = true;
      return;
    }

    // Usa placeholder enquanto carrega
    this.currentSrc = this.placeholder || this.imageOptimizer.generatePlaceholder(100, 100);
    
    // Carrega a imagem real
    this.imageOptimizer.lazyLoadImage(this.src).subscribe({
      next: (url) => {
        this.currentSrc = url;
        this.isLoaded = true;
      },
      error: () => {
        this.hasError = true;
      }
    });
  }

  onImageLoad(): void {
    this.isLoaded = true;
    this.hasError = false;
  }

  onImageError(): void {
    this.hasError = true;
    this.isLoaded = false;
  }
} 