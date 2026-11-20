import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, computed, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  CampoLivro,
  DadosLivro,
  FormularioLivro,
  Livro,
  formularioVazio,
  validarLivro,
} from '../models/livro';
import { AuthService } from '../services/auth.service';
import { LivroService } from '../services/livro.service';
import { ToastService } from '../services/toast.service';

// Cores das lombadas: o mesmo gênero sempre recebe a mesma cor
const CORES_LOMBADA = ['#1c4a40', '#a8322b', '#27456b', '#b07d12', '#5a2a4a', '#3d6b5c', '#8a4b2a', '#44566a'];

/** Remove acentos e maiúsculas para a busca achar "principe" em "Príncipe". */
function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

@Component({
  selector: 'app-biblioteca',
  imports: [FormsModule],
  templateUrl: './biblioteca.html',
  styleUrl: './biblioteca.css',
})
export class Biblioteca implements OnInit {
  private livroService = inject(LivroService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);

  private painel = viewChild.required<ElementRef<HTMLElement>>('painel');
  private dialogo = viewChild.required<ElementRef<HTMLDialogElement>>('dialogo');

  protected readonly usuario = this.auth.usuario;
  protected readonly anoAtual = new Date().getFullYear();

  // Estado da tela
  protected livros = signal<Livro[]>([]);
  protected carregando = signal(true);
  protected processando = signal(false);
  protected busca = signal('');
  protected livroEmEdicao = signal<Livro | null>(null);
  protected livroParaExcluir = signal<Livro | null>(null);
  protected tentouEnviar = signal(false);

  // Formulário (cadastro e edição usam o mesmo)
  form: FormularioLivro = formularioVazio();

  protected livrosFiltrados = computed(() => {
    const termo = normalizar(this.busca().trim());
    if (!termo) return this.livros();
    return this.livros().filter((l) =>
      normalizar(`${l.titulo} ${l.autor} ${l.editora} ${l.genero}`).includes(termo),
    );
  });

  protected resumo = computed(() => {
    const lista = this.livros();
    const paginas = lista.reduce((soma, l) => soma + l.paginas, 0);
    const livros = lista.length === 1 ? '1 livro' : `${lista.length} livros`;
    return `${livros} no acervo, ${paginas.toLocaleString('pt-BR')} páginas no total`;
  });

  ngOnInit() {
    this.carregarLivros();
  }

  // GET - listar
  carregarLivros() {
    this.carregando.set(true);
    this.livroService.listar().subscribe({
      next: (livros) => {
        this.livros.set(livros);
        this.carregando.set(false);
      },
      error: (e: HttpErrorResponse) => {
        this.carregando.set(false);
        this.toast.erroHttp(e, 'Não foi possível carregar os livros.');
      },
    });
  }

  // POST (novo) ou PUT (edição)
  salvar() {
    if (this.processando()) return;

    this.tentouEnviar.set(true);
    if (Object.keys(validarLivro(this.form, this.anoAtual)).length > 0) {
      this.toast.erro('Corrija os campos destacados.');
      return;
    }

    const dados = this.dadosParaEnvio();
    const edicao = this.livroEmEdicao();
    const requisicao = edicao
      ? this.livroService.atualizar(edicao.id, dados)
      : this.livroService.criar(dados);

    this.processando.set(true);
    requisicao.subscribe({
      next: (livro) => {
        this.livros.update((lista) =>
          edicao ? lista.map((l) => (l.id === livro.id ? livro : l)) : [...lista, livro],
        );
        this.toast.sucesso(edicao ? 'Alterações salvas.' : 'Livro adicionado.');
        this.processando.set(false);
        this.cancelar();
      },
      error: (e: HttpErrorResponse) => {
        this.processando.set(false);
        this.toast.erroHttp(e, 'Não foi possível salvar o livro.');
      },
    });
  }

  editar(livro: Livro) {
    if (this.processando()) return;
    this.livroEmEdicao.set(livro);
    this.form = {
      titulo: livro.titulo,
      autor: livro.autor,
      ano: livro.ano,
      editora: livro.editora,
      paginas: livro.paginas,
      genero: livro.genero,
    };
    this.tentouEnviar.set(false);

    const painel = this.painel().nativeElement;
    painel.scrollIntoView?.({ block: 'start' });
    painel.querySelector<HTMLInputElement>('input')?.focus({ preventScroll: true });
  }

  /** Limpa o formulário e sai do modo de edição. */
  cancelar() {
    this.form = formularioVazio();
    this.livroEmEdicao.set(null);
    this.tentouEnviar.set(false);
  }

  // DELETE - com confirmação
  pedirExclusao(livro: Livro) {
    if (this.processando()) return;
    this.livroParaExcluir.set(livro);
    this.dialogo().nativeElement.showModal();
  }

  cancelarExclusao() {
    this.dialogo().nativeElement.close();
  }

  /** Chamado quando o diálogo fecha (botão, Esc ou após excluir). */
  dialogoFechou() {
    this.livroParaExcluir.set(null);
  }

  confirmarExclusao() {
    const livro = this.livroParaExcluir();
    if (!livro || this.processando()) return;

    this.processando.set(true);
    this.livroService.excluir(livro.id).subscribe({
      next: () => {
        this.livros.update((lista) => lista.filter((l) => l.id !== livro.id));
        if (this.livroEmEdicao()?.id === livro.id) this.cancelar();
        this.toast.sucesso('Livro excluído.');
        this.processando.set(false);
        this.cancelarExclusao();
      },
      error: (e: HttpErrorResponse) => {
        this.processando.set(false);
        this.cancelarExclusao();
        this.toast.erroHttp(e, 'Não foi possível excluir o livro.');
      },
    });
  }

  sair() {
    this.auth.logout();
  }

  /** Mensagem de erro de um campo (só aparece depois da primeira tentativa de salvar). */
  erroDoCampo(campo: CampoLivro): string | null {
    if (!this.tentouEnviar()) return null;
    return validarLivro(this.form, this.anoAtual)[campo] ?? null;
  }

  corDaLombada(genero: string): string {
    let soma = 0;
    for (const letra of normalizar(genero)) soma += letra.charCodeAt(0);
    return CORES_LOMBADA[soma % CORES_LOMBADA.length];
  }

  private dadosParaEnvio(): DadosLivro {
    return {
      titulo: this.form.titulo.trim(),
      autor: this.form.autor.trim(),
      ano: this.form.ano as number,
      editora: this.form.editora.trim(),
      paginas: this.form.paginas as number,
      genero: this.form.genero.trim(),
    };
  }
}
