import { Routes } from '@angular/router';

export const caseRoutes: Routes = [
  {
    path: 'allcases',
    loadComponent: () =>
      import('../cases/all-cases/all-cases.page').then((m) => m.AllCasesPage),
    data: { breadcrumb: 'All Cases' },
  },
  {
    path: 'casecreation',
    loadComponent: () => import('../cases/casecreation/case.page').then((m) => m.CasePage),
    data: { breadcrumb: 'Case Creation' },
  },
  {
    path: 'casecreation/:id',
    loadComponent: () => import('../cases/casecreation/case.page').then((m) => m.CasePage),
    data: { breadcrumb: 'Case Details' },
  },
];
