import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
  {
    path: 'jobs',
    loadComponent: () =>
      import('./components/job-list/job-list.component').then(
        (m) => m.JobListComponent
      ),
  },
  {
    path: 'jobs/new',
    loadComponent: () =>
      import('./components/job-form/job-form.component').then(
        (m) => m.JobFormComponent
      ),
  },
  {
    path: 'jobs/:id',
    loadComponent: () =>
      import('./components/job-detail/job-detail.component').then(
        (m) => m.JobDetailComponent
      ),
  },
  {
    path: 'jobs/:id/edit',
    loadComponent: () =>
      import('./components/job-form/job-form.component').then(
        (m) => m.JobFormComponent
      ),
  },
  {
    path: 'analytics',
    loadComponent: () =>
      import('./components/analytics/analytics.component').then(
        (m) => m.AnalyticsComponent
      ),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./components/settings/settings.component').then(
        (m) => m.SettingsComponent
      ),
  },
  {
    path: '**',
    redirectTo: '/dashboard',
  },
];
