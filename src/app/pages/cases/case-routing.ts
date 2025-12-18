import { Routes } from '@angular/router';

export const caseRoutes: Routes = [
  {
    path: 'allcases',
    loadComponent: () =>
      import('./all-cases.page/all-cases.page').then((m) => m.AllCasesPage),
    data: { breadcrumb: 'All Cases' },
  },
  {
    path: 'casecreation',
    loadComponent: () => import('./casecreation.page/case.page').then((m) => m.CasePage),
    data: { breadcrumb: 'Case Creation' },
  },
  {
    path: 'casecreation/:id',
    loadComponent: () => import('./casecreation.page/case.page').then((m) => m.CasePage),
    data: { breadcrumb: 'Case Details' },
  },
];
