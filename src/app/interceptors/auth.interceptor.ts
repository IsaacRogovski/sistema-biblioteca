import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { API_URL } from '../config';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

/**
 * Anexa `Authorization: Bearer <token>` nas chamadas à API e, se a API
 * responder 401 (token ausente, inválido ou expirado), encerra a sessão.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const toast = inject(ToastService);

  const ehApi = req.url.startsWith(API_URL);
  const ehLogin = req.url === `${API_URL}/login`;
  const token = auth.token();

  const requisicao =
    ehApi && !ehLogin && token
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

  return next(requisicao).pipe(
    catchError((erro: HttpErrorResponse) => {
      if (erro.status === 401 && ehApi && !ehLogin) {
        auth.logout();
        toast.info('Sua sessão terminou. Entre novamente.');
      }
      return throwError(() => erro);
    }),
  );
};
