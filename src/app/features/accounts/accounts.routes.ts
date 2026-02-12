import { Routes } from '@angular/router';

/**
 * ACCOUNTS FEATURE ROUTES
 * 
 * Accounting and financial management
 * 
 * Usage: /app/accounts
 */
export const ACCOUNTS_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'Dashboard',
    pathMatch: 'full'
  },
  {
    path: 'Dashboard',
    loadComponent: () => import('./accountsdashboard/accountsdashboard.component').then(m => m.AccountsdashboardComponent),
    data: { title: 'Accounts Dashboard - BizArabia ERP', breadcrumb: 'Dashboard' }
  },
  {
    path: 'company',
    loadComponent: () => import('./company/company.component').then(m => m.CompanyComponent),
    data: { title: 'Accounts - BizArabia ERP', breadcrumb: 'Company' }
  }
];
