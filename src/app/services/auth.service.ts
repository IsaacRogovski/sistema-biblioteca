import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { API_URL } from '../config';

const CHAVE_TOKEN = 'token';

export interface RespostaLogin {
  mensagem: string;
  token: string;
}

interface DadosDoToken {
  usuario?: string;
  exp?: number;
}

/** Cuida do login, do logout e de guardar o token JWT no navegador. */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  // localStorage só existe no navegador (não no servidor do SSR)
  private ehNavegador = isPlatformBrowser(inject(PLATFORM_ID));

  private tokenAtual = signal<string | null>(this.lerArmazenado());

  readonly token = this.tokenAtual.asReadonly();
  readonly usuario = computed(() => this.dadosDoToken(this.tokenAtual())?.usuario ?? null);

  /** Há token e ele ainda não expirou. */
  estaLogado(): boolean {
    const dados = this.dadosDoToken(this.tokenAtual());
    if (!dados) return false;
    return !dados.exp || dados.exp * 1000 > Date.now();
  }

  login(usuario: string, senha: string): Observable<RespostaLogin> {
    return this.http
      .post<RespostaLogin>(`${API_URL}/login`, { usuario, senha })
      .pipe(tap((resposta) => this.guardar(resposta.token)));
  }

  logout() {
    this.guardar(null);
    this.router.navigate(['/login']);
  }

  private guardar(token: string | null) {
    this.tokenAtual.set(token);
    if (!this.ehNavegador) return;
    try {
      if (token) localStorage.setItem(CHAVE_TOKEN, token);
      else localStorage.removeItem(CHAVE_TOKEN);
    } catch {
      // armazenamento bloqueado: o token continua só em memória
    }
  }

  private lerArmazenado(): string | null {
    if (!this.ehNavegador) return null;
    try {
      return localStorage.getItem(CHAVE_TOKEN);
    } catch {
      return null;
    }
  }

  /** Lê o conteúdo (payload) do JWT, sem validar assinatura: quem valida é o backend. */
  private dadosDoToken(token: string | null): DadosDoToken | null {
    if (!token) return null;
    try {
      const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(payload)) as DadosDoToken;
    } catch {
      return null;
    }
  }
}
