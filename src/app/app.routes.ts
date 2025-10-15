import { Routes } from '@angular/router';
import { Layout } from './shared/layout/layout';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth',
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./pages/auth/auth').then((m) => m.Auth),
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./pages/home/home').then((m) => m.Home),
      },
      {
        path: 'materialform',
        loadComponent: () =>
          import('./pages/material-form/material-form').then((m) => m.MaterialForm),
      },
      {
        path: 'bootstrapform',
        loadComponent: () =>
          import('./pages/bootstrap-form/bootstrap-form').then((m) => m.BootstrapForm),
      },
    ],
  },
];
