import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators'; // Adicionado map e removido retry não utilizado aqui
import { environment } from '../environments/environment';

export interface User {
  id: number;
  nome_usuario: string;
  email: string;
  sexo: string;
  data_nascimento: string;
  foto_url?: string | null;
  bio?: string | null;
  role?: string; // 'user' ou 'admin'
  created_at?: string;
  updated_at?: string;
}

export interface UserProfileUpdateData {
  nome_usuario?: string;
  email?: string;
  data_nascimento?: string;
  sexo?: string;
  bio?: string | null;
}

interface RegisterUserData {
  nome_usuario: string;
  email: string;
  password: string;
  password_confirmation: string;
  data_nascimento: string;
  sexo: string;
}

interface RegisterResponse {
  message: string;
  user?: User;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  access_token: string;
  token_type: string;
  user?: User; // Adicionado para consistência se a API retornar o usuário
}

interface UpdateProfileResponse {
  message: string;
  user: User;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private userSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadInitialUser();
  }

  public fetchCurrentUser(): Observable<User | null> {
    const token = this.getToken();
    if (!token) {
      this.userSubject.next(null);
      return of(null);
    }
    return this.http.get<User>(`${this.apiUrl}/me`).pipe(
      tap((user: User) => { // Tipado user
        this.userSubject.next(user);
      }),
      catchError(error => {
        if (error.status === 401) {
          this.removeToken();
          this.userSubject.next(null);
        }
        return of(null);
      })
    );
  }

  private loadInitialUser(): void {
    const token = this.getToken();
    if (token) {
      this.fetchCurrentUser().subscribe();
    }
  }

  public register(userData: RegisterUserData): Observable<RegisterResponse> {
    const registerUrl = `${this.apiUrl}/register`;
    return this.http.post<RegisterResponse>(registerUrl, userData).pipe(
      catchError(error => {
        const errorMessage = error.error?.message || 'Erro ao registrar usuário.';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  public login(credentials: LoginCredentials): Observable<LoginResponse> {
    const loginUrl = `${this.apiUrl}/login`;
    return this.http.post<LoginResponse>(loginUrl, credentials).pipe(
      tap((response: LoginResponse) => { // Tipado response
        this.storeToken(response.access_token);
        if (response.user) { // Se a API de login já retornar o usuário
          this.userSubject.next(response.user);
        } else {
          this.fetchCurrentUser().subscribe();
        }
      }),
      catchError(error => {
        this.userSubject.next(null);
        const errorMessage = error.error?.message || 'Credenciais inválidas.';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  public loginWithGoogle(googleToken: string): Observable<LoginResponse> {
    const url = `${this.apiUrl}/login/google`;
    return this.http.post<LoginResponse>(url, { token: googleToken }).pipe(
      tap((response: LoginResponse) => {
        this.storeToken(response.access_token);
        if (response.user) {
          this.userSubject.next(response.user);
        } else {
          this.fetchCurrentUser().subscribe();
        }
      }),
      catchError(error => {
        this.userSubject.next(null);
        const errorMessage = error.error?.message || 'Erro ao autenticar com Google.';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  public getCurrentUserValue(): User | null {
    return this.userSubject.getValue();
  }

  public updateUser(user: User | null): void {
    this.userSubject.next(user);
  }

  public updateUserProfile(userData: UserProfileUpdateData): Observable<User> {
    const updateUrl = `${this.apiUrl}/usuario/profile`;
    return this.http.put<UpdateProfileResponse>(updateUrl, userData).pipe(
      tap((response: UpdateProfileResponse) => { // Tipado response
        this.updateUser(response.user);
      }),
      map((response: UpdateProfileResponse) => response.user), // Tipado response
      catchError(error => {
        const errorMessage = error.error?.message || 'Erro ao atualizar perfil.';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  public isAuthenticated(): boolean {
    return !!this.getToken();
  }

  public logout(): Observable<any> {
    const logoutUrl = `${this.apiUrl}/logout`;
    const token = this.getToken();

    this.removeToken();
    this.userSubject.next(null);

    if (!token) {
      return of({ message: 'Logout local concluído (sem token para revogar).' });
    }

    return this.http.post(logoutUrl, {}).pipe(
      tap(() => {}),
      catchError(error => {
        return of({ message: 'Logout local concluído, erro na API de logout.' });
      })
    );
  }

  public getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  public storeToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  public removeToken(): void {
    localStorage.removeItem('access_token');
  }
}
