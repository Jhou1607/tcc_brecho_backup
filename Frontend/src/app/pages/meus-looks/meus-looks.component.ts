import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { ProdutoService } from '../../services/product.service';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { Look, LookConfig } from '../../interfaces/interfaces';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-meus-looks',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, FontAwesomeModule, NzModalModule],
  templateUrl: './meus-looks.component.html',
  styleUrls: ['./meus-looks.component.scss']
})
export class MeusLooksComponent implements OnInit {
  faTimes = faTimes;
  looks: Look[] = [];
  isLoading = false;
  error: string | null = null;
  imageBaseUrl = environment.apiUrl.replace('/api', '');

  constructor(
    private produtoService: ProdutoService,
    private router: Router,
    private notification: NzNotificationService,
    private modalService: NzModalService
  ) { }

  ngOnInit(): void {
    this.loadLooksUsuario();
  }

  loadLooksUsuario(): void {
    this.isLoading = true;
    this.error = null;
    this.produtoService.getLooksUsuario().subscribe({
      next: (looks: Look[]) => {
        this.looks = looks;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Não foi possível carregar seus looks. Tente fazer o login novamente.';
        this.isLoading = false;
        console.error('Erro ao carregar looks:', err);
        this.looks = [];
      }
    });
  }

  criarNovoLook(): void {
    this.router.navigate(['/montador-look']);
  }

  viewLook(look: Look): void {
    this.router.navigate(['/montador-look', look.id]);
  }

  editLook(look: Look, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/montador-look'], { queryParams: { lookId: look.id } });
  }

  deleteLook(lookId: number, event: Event): void {
    event.stopPropagation();

    this.modalService.confirm({
      nzTitle: 'Você tem certeza?',
      nzContent: 'Esta ação não pode ser desfeita e o look será removido permanentemente.',
      nzOkText: 'Sim, remover',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.produtoService.deleteLook(lookId).subscribe({
          next: (res) => {
            this.notification.success('Sucesso', res.message || 'Look removido com sucesso!');
            this.looks = this.looks.filter(look => look.id !== lookId); // Remove localmente
          },
          error: (err) => {
            this.notification.error('Erro', err?.error?.message || 'Não foi possível remover o look.');
            console.error('Erro ao remover look:', err);
          }
        });
      },
      nzCancelText: 'Cancelar'
    });
  }
}