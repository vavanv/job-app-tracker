import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'jobs',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'jobs/new',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'analytics',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'settings',
    renderMode: RenderMode.Prerender,
  },
  {
    // For parameterized routes, use Server-side rendering instead of prerendering
    path: 'jobs/:id',
    renderMode: RenderMode.Server,
  },
  {
    // For parameterized edit routes, use Server-side rendering instead of prerendering
    path: 'jobs/:id/edit',
    renderMode: RenderMode.Server,
  },
  {
    // Catch-all route for any other paths
    path: '**',
    renderMode: RenderMode.Server,
  },
];