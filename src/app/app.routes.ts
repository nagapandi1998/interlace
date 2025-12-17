import { Routes } from '@angular/router';
import { MenuSidebar } from './shared/layout/menu-sidebar';
import { authRoutes } from './pages/auth/auth-routing';
import { caseRoutes } from './pages/cases/case-routing';
import { texteditorRoutes } from './pages/texteditor/texteditor-routing';
import { menuRoutes } from './pages/master/master-routing';
import { authGuard } from './helpers/guards/auth-guard';

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
  // Menu wrapper for authorized pages
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
      }
    ],
  },
];
