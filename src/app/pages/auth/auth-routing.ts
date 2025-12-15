import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
        path: 'login',
        loadComponent: () => import('../auth/login/login.page').then((m) => m.AuthPage),
        data: { breadcrumb: 'Auth Login' },
      },
      {
        path: 'changepassword',
        loadComponent: () => import('./change-password/change-password.page').then((m) => m.ChangePasswordPage),
        data: { breadcrumb: 'Change Password' },
      }
];
