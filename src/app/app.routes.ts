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
    loadComponent: () => import('./pages/auth/auth.page').then((m) => m.AuthPage),
    data: { breadcrumb: 'Auth' }
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'casecreation',
        children: [
          {
            path: '',
            loadComponent: () => import('./pages/case/case.page').then((m) => m.CasePage),
            data: { breadcrumb: 'Case Creation' }
          },
          {
            path: ':id',
            loadComponent: () => import('./pages/case/case.page').then((m) => m.CasePage),
            data: { breadcrumb: 'Case Details' }
          },
        ],
      },
      {
        path: 'allcases',
        loadComponent: () => import('./pages/all-cases/all-cases.page').then((m) => m.AllCasesPage),
        data: { breadcrumb: 'All Cases' }
      },
      {
        path: 'texteditor',
        loadComponent: () =>
          import('./pages/text-editor/text-editor.page').then((m) => m.TextEditorPage),
          data: { breadcrumb: 'Text Editor' }
      }
    ],
  },
];
