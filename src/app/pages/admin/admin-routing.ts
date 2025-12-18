import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: 'users',
    loadComponent: () => import('./users.page/users.page').then((m) => m.UsersPage),
    data: { breadcrumb: 'Users' },
  },
  {
    path: 'users/manage',
    loadComponent: () =>
      import('./manage-users.page/manage-users.page').then((m) => m.ManageUsersPage),
    data: { breadcrumb: 'Manage Users' },
  },
];
