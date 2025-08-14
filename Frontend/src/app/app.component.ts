import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { applyPerformanceOptimizations } from './shared/config/performance.config';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    // Aplicar otimizações de performance
    applyPerformanceOptimizations();
    
    // Preload de recursos críticos
    this.preloadCriticalResources();
  }

  private preloadCriticalResources(): void {
    // Preload de fontes críticas
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.href = '/assets/fonts/your-main-font.woff2';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  }
}
