import { Routes } from '@angular/router';
import { MenuSidebar } from './shared/layout/menu-sidebar';
import { authGuard } from './helpers/guards/auth-guard';
import { authRoutes } from './pages/auth/auth-routing';
import { caseRoutes } from './pages/cases/case-routing';
import { texteditorRoutes } from './pages/texteditor/texteditor-routing';
import { menuRoutes } from './pages/master/master-routing';
import { adminRoutes } from './pages/admin/admin-routing';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth/login',
  },
  // Auth route
  {
    path: 'auth',
    children: [...authRoutes],
  },
  // Menu authorized pages
  {
    path: '',
    component: MenuSidebar,
    canActivate: [authGuard],
    children: [
      {
        path: 'courtcase',
        children: [...caseRoutes],
      },
      {
        path: 'texteditor',
        children: [...texteditorRoutes],
      },
      {
        path: 'master',
        children: [...menuRoutes],
      },
      {
        path: 'admin',
        children: [...adminRoutes],
      },
    ],
  },
];
