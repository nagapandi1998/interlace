import { Routes } from '@angular/router';
import { authGuard } from '../../helpers/guards/auth-guard';

export const authRoutes: Routes = [
  {
        path: 'login',
        loadComponent: () => import('./login.page/login.page').then((m) => m.AuthPage),
        data: { breadcrumb: 'Auth Login' },
      },
      {
        path: 'changepassword',
        canActivate: [authGuard],
        loadComponent: () => import('./change-password.page/change-password.page').then((m) => m.ChangePasswordPage),
        data: { breadcrumb: 'Change Password' },
      }
];
