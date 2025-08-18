import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface UserStats {
  looks_favoritados: number;
  pecas_salvas: number;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Abre uma caixa de seleção de arquivos e envia a imagem escolhida para /usuario/foto.
   * @returns Observable com a resposta da API ou null se nenhuma imagem for selecionada.
   */
  uploadFotoUsuario(): Observable<any> {
    return from(new Promise<File | null>(resolve => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.style.display = 'none';
      document.body.appendChild(input);

      input.onchange = () => {
        const file = input.files?.[0] || null;
        document.body.removeChild(input);
        resolve(file);
      };

      input.click();
    })).pipe(
      switchMap(file => {
        if (file) {
          const formData = new FormData();
          formData.append('foto', file, file.name);
          return this.http.post(`${this.apiUrl}/usuario/foto`, formData);
        }
        return of(null);
      })
    );
  }

  /**
   * Busca as estatísticas do usuário (looks favoritados e peças salvas)
   * @returns Observable com as estatísticas do usuário
   */
  getEstatisticas(): Observable<UserStats> {
    return this.http.get<{success: boolean, data: UserStats}>(`${this.apiUrl}/usuario/estatisticas`)
      .pipe(
        switchMap(response => {
          if (response.success) {
            return of(response.data);
          } else {
            throw new Error('Erro ao buscar estatísticas');
          }
        })
      );
  }
}
