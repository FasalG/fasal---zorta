import { Routes } from '@angular/router';
import { ModulesPageComponent } from './modules-page/modules-page.component';

/**
 * MODULES FEATURE ROUTES
 * 
 * Module management and configuration pages
 * Wrapped in HeaderOnlyLayoutComponent (header only, no sidebar)
 * 
 * Usage: /app/modules, /app/modules/details/:id
 */
export const MODULES_ROUTES: Routes = [
  {
    path: '',
    component: ModulesPageComponent,
    data: { title: 'Modules - BizArabia ERP' }
  },

  // Add more module routes as needed
  // {
  //   path: ':id',
  //   loadComponent: () =>
  //     import('./module-detail/module-detail').then(m => m.ModuleDetailComponent),
  //   data: { title: 'Module Detail - BizArabia ERP' }
  // }
];
