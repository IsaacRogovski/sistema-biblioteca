import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';

export type TipoAviso = 'sucesso' | 'erro' | 'info';

export interface Aviso {
  id: number;
  tipo: TipoAviso;
  texto: string;
}

/** Avisos rápidos no canto da tela (substitui os alert()). */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private proximoId = 0;
  readonly avisos = signal<Aviso[]>([]);

  sucesso(texto: string) {
    this.mostrar('sucesso', texto);
  }

  erro(texto: string) {
    this.mostrar('erro', texto, 6000);
  }

  info(texto: string) {
    this.mostrar('info', texto);
  }

  /**
   * Mostra o erro de uma chamada HTTP. O 401 fica de fora porque o interceptor
   * já avisa que a sessão terminou e leva para o login.
   */
  erroHttp(erro: HttpErrorResponse, padrao: string) {
    if (erro.status === 401) return;
    if (erro.status === 0) {
      this.erro('Sem conexão com a API. Confira se o backend está rodando (npm run api).');
      return;
    }
    this.erro(erro.error?.mensagem ?? padrao);
  }

  fechar(id: number) {
    this.avisos.update((lista) => lista.filter((aviso) => aviso.id !== id));
  }

  private mostrar(tipo: TipoAviso, texto: string, duracao = 4000) {
    const id = ++this.proximoId;
    this.avisos.update((lista) => [...lista, { id, tipo, texto }]);
    setTimeout(() => this.fechar(id), duracao);
  }
}
