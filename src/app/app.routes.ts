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
    loadComponent: () => import('./pages/auth/auth').then((m) => m.Auth),
    data: { breadcrumb: 'Auth' }
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home').then((m) => m.Home),
        data: { breadcrumb: 'Home' }
      },
      {
        path: 'materialform',
        loadComponent: () =>
          import('./pages/material-form/material-form').then((m) => m.MaterialForm),
          data: { breadcrumb: 'Material Form' }
      },
      {
        path: 'bootstrapform',
        loadComponent: () =>
          import('./pages/bootstrap-form/bootstrap-form').then((m) => m.BootstrapForm),
          data: { breadcrumb: 'Bootstrap Form' }
      },
      {
        path: 'casecreation',
        children: [
          {
            path: '',
            loadComponent: () => import('./pages/case/case').then((m) => m.Case),
            data: { breadcrumb: 'Case Creation' }
          },
          {
            path: ':id',
            loadComponent: () => import('./pages/case/case').then((m) => m.Case),
            data: { breadcrumb: 'Case Details' }
          },
        ],
      },
      {
        path: 'allcases',
        loadComponent: () => import('./pages/all-cases/all-cases').then((m) => m.AllCases),
        data: { breadcrumb: 'All Cases' }
      },
      {
        path: 'tinytexteditor',
        loadComponent: () =>
          import('./pages/tiny-mce-text-editor/tiny-mce-text-editor').then(
            (m) => m.TinyMCETextEditor
          ),
          data: { breadcrumb: 'TinyMCE Text Editor' }
      },
      {
        path: 'texteditor',
        loadComponent: () =>
          import('./pages/text-editor/text-editor').then((m) => m.TextEditor),
          data: { breadcrumb: 'Text Editor' }
      }
    ],
  },
];
