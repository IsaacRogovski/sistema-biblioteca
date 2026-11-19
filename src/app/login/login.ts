
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  imports: [FormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  usuario = "";
  senha = "";

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  Entrar() {

    const dadosLogin = {
      usuario: this.usuario,
      senha: this.senha
    };

    this.http.post<any>('http://localhost:3000/login', dadosLogin)
      .subscribe({
        next: (resposta) => {
          localStorage.setItem('token', resposta.token);
          alert("Login realizado com sucesso!");
          this.router.navigate(['/biblioteca']);
        },

        error: (erro) => {
          alert("Usuário ou senha incorretos!");
          this.LimparCampos();
        }
      });
  }

  LimparCampos() {
    this.usuario = "";
    this.senha = "";
  }
}


