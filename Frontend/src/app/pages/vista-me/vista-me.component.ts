import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-vista-me',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FontAwesomeModule],
  templateUrl: './vista-me.component.html',
  styleUrls: ['./vista-me.component.scss']
})
export class VistaMeComponent {

  constructor(private router: Router) { }

  navegarPara(rota: string): void {
    this.router.navigate([rota]);
  }
}
