import { Routes } from '@angular/router';
import { MenuSidebar } from './shared/layout/menu-sidebar';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth/login',
  },
  // Auth route
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./pages/auth/auth.page').then((m) => m.AuthPage),
        data: { breadcrumb: 'Auth Login' },
      },
      {
        path: 'changepassword',
        loadComponent: () => import('./pages/change-password/change-password').then((m) => m.ChangePassword),
        data: { breadcrumb: 'Change Password' },
      }
    ],
  },
  // Menu wrapper for authorized pages
  {
    path: '',
    component: MenuSidebar,
    children: [
      {
        path: 'courtcase',
        children: [
          {
            path: 'allcases',
            loadComponent: () =>
              import('./pages/all-cases/all-cases.page').then((m) => m.AllCasesPage),
            data: { breadcrumb: 'All Cases' },
          },
          {
            path: 'casecreation',
            loadComponent: () => import('./pages/case/case.page').then((m) => m.CasePage),
            data: { breadcrumb: 'Case Creation' },
          },
          {
            path: 'casecreation/:id',
            loadComponent: () => import('./pages/case/case.page').then((m) => m.CasePage),
            data: { breadcrumb: 'Case Details' },
          },
        ],
      },
      {
        path: 'texteditor',
        children: [
          {
            path: 'editor',
            loadComponent: () =>
              import('./pages/text-editor/text-editor.page').then((m) => m.TextEditorPage),
            data: { breadcrumb: 'Text Editor' },
          },
        ],
      },
    ],
  },
];
