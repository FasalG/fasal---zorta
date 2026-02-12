import { Routes } from '@angular/router';

/**
 * SETTINGS FEATURE ROUTES
 * 
 * Configuration and settings pages for the application
 * 
 * Usage: /app/settings
 */
export const SETTINGS_ROUTES: Routes = [
    {
        path: '',
        redirectTo: 'Dashboard',
        pathMatch: 'full'
    },
    {
        path: 'Dashboard',
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
        data: { title: 'Settings - BizArabia ERP', breadcrumb: 'Dashboard' }
    }
];
