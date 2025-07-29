// src/app/shared/components/look-name-modal/look-name-modal.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalRef } from 'ng-zorro-antd/modal'; // Certifique-se de importar NzModalRef
import { NzButtonModule } from 'ng-zorro-antd/button'; // Para usar nz-button

@Component({
  selector: 'app-look-name-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, // Para [(ngModel)]
    NzInputModule, // Para nz-input
    NzButtonModule // Para nz-button
  ],
  templateUrl: './look-name-modal.component.html',
  styleUrls: ['./look-name-modal.component.scss']
})
export class LookNameModalComponent {
  lookName: string | null = null; // Propriedade para o ngModel

  constructor(private modalRef: NzModalRef) { } // Injeta o NzModalRef

  // Chamado quando o botão "Salvar" dentro do modal é clicado
  handleOk(): void {
    // Fecha o modal e passa o valor de lookName para o nzOnOk do componente pai
    this.modalRef.close(this.lookName);
  }

  // Chamado quando o botão "Cancelar" dentro do modal é clicado
  handleCancel(): void {
    // Destrói o modal sem passar nenhum valor (equivale a cancelar)
    this.modalRef.destroy();
  }
}