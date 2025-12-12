import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
        path: 'login',
        loadComponent: () => import('../auth/login/login.page').then((m) => m.AuthPage),
        data: { breadcrumb: 'Auth Login' },
      },
      {
        path: 'changepassword',
        loadComponent: () => import('../auth/change-password/change-password').then((m) => m.ChangePassword),
        data: { breadcrumb: 'Change Password' },
      }
];
