import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { API_URL } from '../config';
import { Livro } from '../models/livro';
import { Biblioteca } from './biblioteca';

const LIVROS: Livro[] = [
  { id: 1, titulo: 'O Pequeno Príncipe', autor: 'Saint-Exupéry', ano: 1943, editora: 'Agir', paginas: 96, genero: 'Ficção' },
  { id: 2, titulo: 'O Hobbit', autor: 'J.R.R. Tolkien', ano: 1937, editora: 'Allen & Unwin', paginas: 310, genero: 'Fantasia' },
];

describe('Biblioteca', () => {
  let fixture: ComponentFixture<Biblioteca>;
  let http: HttpTestingController;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Biblioteca],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Biblioteca);
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    http.expectOne(`${API_URL}/livros`).flush(LIVROS);
    await fixture.whenStable();
  });

  it('lista os livros devolvidos pela API', () => {
    const titulos = Array.from(fixture.nativeElement.querySelectorAll('.ficha h3')).map(
      (el) => (el as HTMLElement).textContent?.trim(),
    );
    expect(titulos).toEqual(['O Pequeno Príncipe', 'O Hobbit']);
  });

  it('filtra pela busca ignorando acentos', async () => {
    const componente = fixture.componentInstance as unknown as { busca: { set(v: string): void } };
    componente.busca.set('principe');
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelectorAll('.ficha').length).toBe(1);
  });

  it('não envia o formulário inválido', () => {
    fixture.componentInstance.salvar();
    http.expectNone(`${API_URL}/livros`);
  });

  it('cadastra um livro válido com POST', async () => {
    const c = fixture.componentInstance;
    c.form = { titulo: 'Iracema', autor: 'José de Alencar', ano: 1865, editora: 'Ática', paginas: 120, genero: 'Romance' };
    c.salvar();

    const req = http.expectOne(`${API_URL}/livros`);
    expect(req.request.method).toBe('POST');
    req.flush({ id: 3, ...c.form });
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelectorAll('.ficha').length).toBe(3);
  });
});
