import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

interface Lombada {
  titulo: string;
  cor: string;
  texto: string;
  altura: number; // % da altura da estante
  largura: number; // rem
  inclinada?: boolean;
}

// Livros que enfeitam a estante da tela de login (só visual)
const LOMBADAS: Lombada[] = [
  { titulo: 'Dom Casmurro', cor: '#a8322b', texto: '#fff', altura: 78, largura: 3.1 },
  { titulo: '1984', cor: '#f2efe6', texto: '#172230', altura: 58, largura: 2.6 },
  { titulo: 'O Pequeno Príncipe', cor: '#27456b', texto: '#fff', altura: 92, largura: 3.4 },
  { titulo: 'Vidas Secas', cor: '#e0a526', texto: '#172230', altura: 66, largura: 2.8 },
  { titulo: 'Grande Sertão', cor: '#5a2a4a', texto: '#fff', altura: 84, largura: 3.6 },
  { titulo: 'Iracema', cor: '#3d6b5c', texto: '#fff', altura: 54, largura: 2.5 },
  { titulo: 'Capitães da Areia', cor: '#c9d6df', texto: '#172230', altura: 88, largura: 3.2 },
  { titulo: 'O Hobbit', cor: '#8a4b2a', texto: '#fff', altura: 70, largura: 3 },
  { titulo: 'O Cortiço', cor: '#133830', texto: '#fff', altura: 60, largura: 2.7 },
  { titulo: 'Memórias Póstumas', cor: '#a8322b', texto: '#fff', altura: 94, largura: 3.5 },
  { titulo: 'Quincas Borba', cor: '#f2efe6', texto: '#172230', altura: 76, largura: 3 },
  { titulo: 'A Hora da Estrela', cor: '#27456b', texto: '#fff', altura: 82, largura: 3.2, inclinada: true },
  { titulo: 'Senhora', cor: '#e0a526', texto: '#172230', altura: 64, largura: 2.7 },
  { titulo: 'O Alienista', cor: '#3d6b5c', texto: '#fff', altura: 72, largura: 2.9 },
  { titulo: 'Macunaíma', cor: '#a8322b', texto: '#fff', altura: 80, largura: 3.1 },
  { titulo: 'Ensaio sobre a Cegueira', cor: '#f2efe6', texto: '#172230', altura: 96, largura: 3.5 },
  { titulo: 'Fahrenheit 451', cor: '#8a4b2a', texto: '#fff', altura: 74, largura: 3.2 },
  { titulo: 'O Guarani', cor: '#27456b', texto: '#fff', altura: 62, largura: 2.8 },
];

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);

  protected readonly lombadas = LOMBADAS;

  usuario = '';
  senha = '';

  protected enviando = signal(false);
  protected erro = signal<string | null>(null);
  protected senhaVisivel = signal(false);

  entrar() {
    if (this.enviando()) return;

    if (!this.usuario.trim() || !this.senha) {
      this.erro.set('Informe o usuário e a senha.');
      return;
    }

    this.enviando.set(true);
    this.erro.set(null);

    this.auth.login(this.usuario.trim(), this.senha).subscribe({
      next: () => this.router.navigate(['/biblioteca']),
      error: (e: HttpErrorResponse) => {
        this.enviando.set(false);
        this.senha = '';
        this.erro.set(
          e.status === 0
            ? 'Sem conexão com a API. Confira se o backend está rodando (npm run api).'
            : (e.error?.mensagem ?? 'Não foi possível entrar. Tente de novo.'),
        );
      },
    });
  }

  alternarSenha() {
    this.senhaVisivel.update((visivel) => !visivel);
  }
}
