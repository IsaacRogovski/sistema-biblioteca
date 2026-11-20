import { RenderMode, ServerRoute } from '@angular/ssr';

// As telas dependem do token no navegador (localStorage), então são
// renderizadas só no cliente. Isso evita o erro "localStorage is not defined".
export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Client,
  },
];
