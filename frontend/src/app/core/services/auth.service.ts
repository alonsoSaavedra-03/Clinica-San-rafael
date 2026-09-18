import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { User, AuthResponse, UserRole } from '../models/user.model';
import { MockDataService } from './mock-data.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private mockData = inject(MockDataService);

  private readonly TOKEN_KEY = 'sr_auth_token';
  private readonly USER_KEY = 'sr_current_user';
  private readonly LOGGED_OUT_KEY = 'sr_logged_out';

  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Si es la primera visita y el usuario no ha cerrado sesión explícitamente, iniciar demo
    const wasLoggedOut = localStorage.getItem(this.LOGGED_OUT_KEY) === 'true';
    if (!this.currentUserSubject.value && !wasLoggedOut) {
      const defaultUser = this.mockData.getUsers().find(u => u.role === 'paciente');
      if (defaultUser) {
        this.setUserSession(defaultUser, 'mock_token_patient_123');
      }
    } else if (this.currentUserSubject.value) {
      // Sincronizar avatar_url con mockData actualizado
      const current = this.currentUserSubject.value;
      const fresh = this.mockData.getUsers().find(u => u.id === current.id);
      if (fresh && fresh.avatar_url && current.avatar_url !== fresh.avatar_url) {
        current.avatar_url = fresh.avatar_url;
        localStorage.setItem(this.USER_KEY, JSON.stringify(current));
        this.currentUserSubject.next(current);
      }
    }
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public isAuthenticated(): boolean {
    return !!this.currentUserSubject.value && !!this.getToken();
  }

  public getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  public hasRole(role: UserRole): boolean {
    return this.currentUserSubject.value?.role === role;
  }

  /**
   * Inicio de sesión (soporta API Laravel Sanctum o Modo Mock).
   */
  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    if (!environment.useMock) {
      return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials).pipe(
        tap(res => {
          if (res.success && res.token) {
            localStorage.removeItem(this.LOGGED_OUT_KEY);
            this.setUserSession(res.user, res.token);
          }
        })
      );
    }

    // Modo Mock
    const users = this.mockData.getUsers();
    const cleanEmail = (credentials.email || '').trim().toLowerCase();
    const found = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!found) {
      return throwError(() => new Error('Credenciales incorrectas. Verifique el correo electrónico ingresado.'));
    }

    // Permitir ingreso con credenciales de prueba o contraseña mínima de 6 caracteres
    if (!credentials.password || credentials.password.length < 6) {
      return throwError(() => new Error('La contraseña debe contener al menos 6 caracteres.'));
    }

    localStorage.removeItem(this.LOGGED_OUT_KEY);
    const token = `sr_token_${found.role}_${Date.now()}`;
    const response: AuthResponse = {
      success: true,
      message: 'Inicio de sesión exitoso.',
      user: found,
      token
    };

    this.setUserSession(found, token);
    return of(response);
  }

  /**
   * Registro de nuevo paciente.
   */
  register(userData: {
    name: string;
    email: string;
    password: string;
    dni: string;
    phone: string;
    birth_date?: string;
    address?: string;
  }): Observable<AuthResponse> {
    if (!environment.useMock) {
      return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, userData).pipe(
        tap(res => {
          if (res.success && res.token) {
            this.setUserSession(res.user, res.token);
          }
        })
      );
    }

    // Modo Mock
    const users = this.mockData.getUsers();
    if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
      return throwError(() => new Error('El correo electrónico ya se encuentra registrado.'));
    }

    const newUser: User = {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      role: 'paciente',
      dni: userData.dni,
      phone: userData.phone,
      birth_date: userData.birth_date,
      address: userData.address,
      created_at: new Date().toISOString()
    };

    users.push(newUser);
    this.mockData.saveUsers(users);

    const token = `sr_token_paciente_${Date.now()}`;
    const response: AuthResponse = {
      success: true,
      message: 'Registro exitoso.',
      user: newUser,
      token
    };

    this.setUserSession(newUser, token);
    return of(response);
  }

  /**
   * Cierre de sesión.
   */
  logout(): void {
    if (!environment.useMock && this.getToken()) {
      this.http.post(`${environment.apiUrl}/auth/logout`, {}).pipe(
        catchError(() => of(null))
      ).subscribe();
    }

    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.setItem(this.LOGGED_OUT_KEY, 'true');
    this.currentUserSubject.next(null);
  }

  /**
   * Cambio rápido de rol para demostración y evaluación del jurado/usuario.
   */
  switchDemoUser(role: UserRole): void {
    localStorage.removeItem(this.LOGGED_OUT_KEY);
    const users = this.mockData.getUsers();
    const target = users.find(u => u.role === role);
    if (target) {
      this.setUserSession(target, `demo_token_${role}`);
    }
  }

  private setUserSession(user: User, token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private getStoredUser(): User | null {
    const raw = localStorage.getItem(this.USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
}
