import { Routes } from '@angular/router';

export const menuRoutes: Routes = [
  {
    path: 'menu',
    loadComponent: () => import('../master/menu.page/menu.page').then((m) => m.MenuPage),
    data: { breadcrumb: 'Menu' },
  },
  {
    path: 'menupermission',
    loadComponent: () => import('../master/menu-permission.page/menu-permission.page').then((m) => m.MenuPermissionPage),
    data: { breadcrumb: 'Menu Permission' },
  },
];
