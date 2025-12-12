import { Routes } from '@angular/router';

export const texteditorRoutes: Routes = [
  {
    path: 'editor',
    loadComponent: () =>
      import('../texteditor/editor/editor.page').then((m) => m.TextEditorPage),
    data: { breadcrumb: 'Text Editor' },
  },
];
