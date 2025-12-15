import { Routes } from '@angular/router';

export const menuRoutes: Routes = [
  {
        path: 'menu',
        loadComponent: () => import('../master/menu.page/menu.page').then((m) => m.MenuPage),
        data: { breadcrumb: 'Menu' },
      },
];
