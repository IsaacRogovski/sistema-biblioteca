import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { API_URL } from '../config';
import { Login } from './login';

describe('Login', () => {
  let fixture: ComponentFixture<Login>;
  let component: Login;
  let http: HttpTestingController;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('não chama a API com campos vazios', () => {
    component.entrar();
    http.expectNone(`${API_URL}/login`);
  });

  it('mostra a mensagem da API quando o login falha', async () => {
    component.usuario = 'ADMISAAC';
    component.senha = 'errada';
    component.entrar();

    http
      .expectOne(`${API_URL}/login`)
      .flush({ mensagem: 'Usuário ou senha incorretos.' }, { status: 401, statusText: 'Unauthorized' });
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Usuário ou senha incorretos.');
  });
});
