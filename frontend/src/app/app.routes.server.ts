import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'notice/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'event/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'dashboard/**',
    renderMode: RenderMode.Server
  },
  {
    path: 'admin/**',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
