import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { API_URL } from '../config';
import { AuthService } from './auth.service';

/** Monta um JWT de mentira só com o payload (a assinatura não é lida no front). */
function jwtFalso(payload: object): string {
  return `x.${btoa(JSON.stringify(payload))}.y`;
}

describe('AuthService', () => {
  let auth: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: 'login', children: [] }]), provideHttpClient(), provideHttpClientTesting()],
    });
    auth = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  it('começa sem login', () => {
    expect(auth.estaLogado()).toBe(false);
  });

  it('guarda o token no login e expõe o usuário', () => {
    const token = jwtFalso({ usuario: 'ADMISAAC', exp: Math.floor(Date.now() / 1000) + 3600 });
    auth.login('ADMISAAC', '12345').subscribe();
    http.expectOne(`${API_URL}/login`).flush({ mensagem: 'ok', token });

    expect(auth.estaLogado()).toBe(true);
    expect(auth.usuario()).toBe('ADMISAAC');
    expect(localStorage.getItem('token')).toBe(token);
  });

  it('considera token expirado como deslogado', () => {
    const token = jwtFalso({ usuario: 'ADMISAAC', exp: Math.floor(Date.now() / 1000) - 10 });
    auth.login('ADMISAAC', '12345').subscribe();
    http.expectOne(`${API_URL}/login`).flush({ mensagem: 'ok', token });

    expect(auth.estaLogado()).toBe(false);
  });

  it('logout apaga o token', () => {
    const token = jwtFalso({ usuario: 'ADMISAAC', exp: Math.floor(Date.now() / 1000) + 3600 });
    auth.login('ADMISAAC', '12345').subscribe();
    http.expectOne(`${API_URL}/login`).flush({ mensagem: 'ok', token });

    auth.logout();

    expect(auth.estaLogado()).toBe(false);
    expect(localStorage.getItem('token')).toBeNull();
  });
});
