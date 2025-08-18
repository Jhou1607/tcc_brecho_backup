import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-sobre-nos',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './sobre-nos.component.html',
  styleUrls: ['./sobre-nos.component.scss'],
  animations: [
    trigger('fadeInUp', [
      state('hidden', style({
        opacity: 0,
        transform: 'translateY(30px)'
      })),
      state('visible', style({
        opacity: 1,
        transform: 'translateY(0)'
      })),
      transition('hidden => visible', [
        animate('0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)')
      ])
    ]),
    
    trigger('slideInLeft', [
      state('hidden', style({
        opacity: 0,
        transform: 'translateX(-50px)'
      })),
      state('visible', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      transition('hidden => visible', [
        animate('0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)')
      ])
    ]),
    
    trigger('slideInRight', [
      state('hidden', style({
        opacity: 0,
        transform: 'translateX(50px)'
      })),
      state('visible', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      transition('hidden => visible', [
        animate('0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)')
      ])
    ]),
    
    trigger('delay', [
      transition('* => *', [
        animate('0s')
      ])
    ])
  ]
})
export class SobreNosComponent {
  // Component logic here
}
