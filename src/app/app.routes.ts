import { Routes } from '@angular/router';

import { Login } from './login/login';
import { Biblioteca } from './biblioteca/biblioteca';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'biblioteca', component: Biblioteca },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
