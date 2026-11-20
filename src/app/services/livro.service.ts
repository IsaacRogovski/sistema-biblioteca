import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../config';
import { DadosLivro, Livro } from '../models/livro';

/** Chamadas ao CRUD de livros. O token é anexado pelo interceptor. */
@Injectable({ providedIn: 'root' })
export class LivroService {
  private http = inject(HttpClient);
  private url = `${API_URL}/livros`;

  listar(): Observable<Livro[]> {
    return this.http.get<Livro[]>(this.url);
  }

  criar(dados: DadosLivro): Observable<Livro> {
    return this.http.post<Livro>(this.url, dados);
  }

  atualizar(id: number, dados: DadosLivro): Observable<Livro> {
    return this.http.put<Livro>(`${this.url}/${id}`, dados);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
