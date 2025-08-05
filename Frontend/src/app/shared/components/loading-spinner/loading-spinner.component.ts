import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-container" [class.small]="size === 'small'" [class.large]="size === 'large'">
      <div class="loading-spinner"></div>
      <p *ngIf="message" class="loading-message">{{ message }}</p>
    </div>
  `,
  styles: [`
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
      min-height: 100px;
    }
    
    .loading-container.small {
      min-height: 60px;
      padding: 10px;
    }
    
    .loading-container.large {
      min-height: 200px;
      padding: 40px;
    }
    
    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #f3f3f3;
      border-top: 3px solid #1890ff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    .loading-container.small .loading-spinner {
      width: 24px;
      height: 24px;
      border-width: 2px;
    }
    
    .loading-container.large .loading-spinner {
      width: 60px;
      height: 60px;
      border-width: 4px;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .loading-message {
      margin-top: 12px;
      color: #666;
      font-size: 14px;
      text-align: center;
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() message: string = '';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
} 