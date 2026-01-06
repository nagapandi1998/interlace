import { Routes } from '@angular/router';

export const texteditorRoutes: Routes = [
  {
    path: 'editor',
    loadComponent: () => import('./editor.page/editor.page').then((m) => m.TextEditorPage),
    data: { breadcrumb: 'Text Editor' },
  },
];
