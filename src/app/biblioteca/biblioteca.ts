import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-biblioteca',
  imports: [FormsModule],
  templateUrl: './biblioteca.html',
  styleUrl: './biblioteca.css'
})
export class Biblioteca implements OnInit {

  titulo = "Minha Biblioteca";
  private API = 'http://localhost:3000/livros';

  livros: any[] = [];

  novoLivro = {
    titulo: "",
    autor: "",
    ano: 0,
    editora: "",
    paginas: 0,
    genero: ""
  };

  LivroEmEdicao: any = null;
  carregando = false;
  processando = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef // Atualiza a tela pra evitar erro
  ) {}

  ngOnInit() {
    this.CarregarLivros();
  }

  Opcoes() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
      Authorization: `Bearer ${token}`
      })
    };
  }

  // GET - Listar livros
  CarregarLivros() {
    if (this.carregando) return;
    this.carregando = true;

    this.http.get<any[]>(this.API, this.Opcoes())
      .subscribe({
        next: (resposta) => {
          this.livros = resposta;
          this.carregando = false;
          this.cdr.detectChanges(); // Atualiza o HTML na hora
        },
        error: (erro) => {
          this.carregando = false;
          this.cdr.detectChanges();
          alert("Não foi possível carregar os livros.");

          if (erro.status === 401) {
            localStorage.removeItem('token');
            this.router.navigate(['/login']);
          }
        }
      });
  }

  ValidarLivro(livro: any): boolean {
    if (
      !livro.titulo?.trim() ||
      !livro.autor?.trim() ||
      livro.ano <= 0 ||
      !livro.editora?.trim() ||
      livro.paginas <= 0 ||
      !livro.genero?.trim()
    ) {
      alert("Por favor, preencha todos os campos.");
      return false;
    }

    if (livro.ano > 2026) {
      alert("O ano do livro não pode ser maior que 2026.");
      return false;
    }
    if (livro.ano <= 0) {
      alert("O ano do livro não pode ser menor ou igual a 0.");
      return false;
    }

    return true;
  }

  // POST - Adicionar livro
  AdicionarLivro() {
    if (this.processando) return;
    if (!this.ValidarLivro(this.novoLivro)) return;

    this.processando = true;

    this.http.post(
      this.API,
      this.novoLivro,
      {
        ...this.Opcoes(),
        responseType: 'text' // Evita erro de texto vazio
      }
    ).subscribe({
      next: () => {
        this.LimparCampos();
        this.processando = false;
        this.CarregarLivros(); 
        alert("Livro cadastrado com sucesso!");
      },
      error: (erro) => {
        this.processando = false;
        this.cdr.detectChanges();
        console.error("Erro ao cadastrar:", erro);
        alert("Erro ao cadastrar livro.");
      }
    });
  }

  // Preparar livro para edição
  EditarLivro(livro: any) {
    if (this.processando) return;
    this.novoLivro = { ...livro };
    this.LivroEmEdicao = livro;
  }

  // PUT - Salvar edição
  SalvarEdicao() {
    if (this.processando || this.LivroEmEdicao === null) return;
    if (!this.ValidarLivro(this.novoLivro)) return;

    this.processando = true;
    const id = this.LivroEmEdicao.id;

    this.http.put(
      `${this.API}/${id}`,
      this.novoLivro,
      {
        ...this.Opcoes(),
        responseType: 'text' 
      }
    ).subscribe({
      next: () => {
        this.LimparCampos();
        this.LivroEmEdicao = null;
        this.processando = false;
        this.CarregarLivros(); 
        alert("Livro atualizado com sucesso!");
      },
      error: (erro) => {
        this.processando = false;
        this.cdr.detectChanges();
        console.error("Erro ao atualizar:", erro);
        alert("Erro ao atualizar livro.");
      }
    });
  }

  // DELETE - Excluir livro
  ExcluirLivro(livro: any) {
    if (this.processando) return;
    this.processando = true;

    this.http.delete(
      `${this.API}/${livro.id}`,
      {
        ...this.Opcoes(),
        responseType: 'text'
      }
    ).subscribe({
      next: () => {
        this.livros = this.livros.filter(l => l.id !== livro.id);
        this.processando = false;
        this.cdr.detectChanges(); 
      },
      error: (erro) => {
        this.processando = false;
        this.cdr.detectChanges();
        console.error("Erro ao excluir:", erro);
        alert("Erro ao excluir livro.");
      }
    });
  }

  LimparCampos() {
    this.novoLivro = {
      titulo: "",
      autor: "",
      ano: 0,
      editora: "",
      paginas: 0,
      genero: ""
    };
  }

  MetodoCancelarEdicao() {
    this.LimparCampos();
    this.LivroEmEdicao = null;
  }

  MetodoCancelarAdicao() {
    this.LimparCampos();
  }
}