import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImageOptimizerService {

  constructor() { }

  // Lazy loading de imagens
  lazyLoadImage(imageUrl: string): Observable<string> {
    return new Observable(observer => {
      const img = new Image();
      
      img.onload = () => {
        observer.next(imageUrl);
        observer.complete();
      };
      
      img.onerror = () => {
        observer.error('Failed to load image');
      };
      
      img.src = imageUrl;
    });
  }

  // Redimensionar imagem para melhor performance
  resizeImage(file: File, maxWidth: number = 800, maxHeight: number = 600): Observable<File> {
    return new Observable(observer => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        const { width, height } = this.calculateDimensions(img.width, img.height, maxWidth, maxHeight);
        
        canvas.width = width;
        canvas.height = height;
        
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(blob => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            observer.next(resizedFile);
            observer.complete();
          } else {
            observer.error('Failed to resize image');
          }
        }, file.type, 0.8); // 80% quality
      };
      
      img.onerror = () => {
        observer.error('Failed to load image for resizing');
      };
      
      img.src = URL.createObjectURL(file);
    });
  }

  // Calcular dimensões mantendo proporção
  private calculateDimensions(width: number, height: number, maxWidth: number, maxHeight: number): { width: number, height: number } {
    let newWidth = width;
    let newHeight = height;
    
    if (width > maxWidth) {
      newWidth = maxWidth;
      newHeight = (height * maxWidth) / width;
    }
    
    if (newHeight > maxHeight) {
      newHeight = maxHeight;
      newWidth = (newWidth * maxHeight) / newHeight;
    }
    
    return { width: newWidth, height: newHeight };
  }

  // Gerar placeholder para imagens
  generatePlaceholder(width: number, height: number, text: string = 'Loading...'): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = width;
    canvas.height = height;
    
    if (ctx) {
      // Background
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, width, height);
      
      // Text
      ctx.fillStyle = '#999';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, width / 2, height / 2);
    }
    
    return canvas.toDataURL();
  }

  // Verificar se imagem está em cache
  isImageCached(url: string): boolean {
    const img = new Image();
    img.src = url;
    return img.complete;
  }

  // Pré-carregar imagens
  preloadImages(urls: string[]): Observable<string[]> {
    const loadPromises = urls.map(url => 
      new Promise<string>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = () => reject(url);
        img.src = url;
      })
    );
    
    return from(Promise.all(loadPromises)).pipe(
      catchError(error => {
        console.warn('Some images failed to preload:', error);
        return of(urls);
      })
    );
  }
} 