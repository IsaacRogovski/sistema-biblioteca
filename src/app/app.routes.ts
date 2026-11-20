import { Routes } from '@angular/router';

import { Biblioteca } from './biblioteca/biblioteca';
import { authGuard, visitanteGuard } from './guards/auth.guard';
import { Login } from './login/login';

export const routes: Routes = [
  { path: 'login', component: Login, canActivate: [visitanteGuard], title: 'Entrar | Minha Biblioteca' },
  { path: 'biblioteca', component: Biblioteca, canActivate: [authGuard], title: 'Acervo | Minha Biblioteca' },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
