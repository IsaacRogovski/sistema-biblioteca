import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/** Só deixa entrar na biblioteca quem tem um token válido. */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.estaLogado() ? true : router.createUrlTree(['/login']);
};

/** Quem já está logado não precisa ver a tela de login de novo. */
export const visitanteGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.estaLogado() ? router.createUrlTree(['/biblioteca']) : true;
};
