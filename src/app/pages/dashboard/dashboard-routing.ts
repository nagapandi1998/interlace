import { Routes } from '@angular/router';

export const dashboardRoutes: Routes = [
  {
    path: 'admin',
    loadComponent: () => import('./admin-dashboard/admin-dashboard').then((m) => m.AdminDashboard),
    data: { breadcrumb: 'Admin Dashboard' },
  },
];
