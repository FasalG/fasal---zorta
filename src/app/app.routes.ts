import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { PermissionGuard } from './core/guards/permission.guard';

/**
 * ROOT APPLICATION ROUTES
 * 
 * Structure:
 * - /auth/* → Public authentication routes (login, signup, forgot-password)
 * - /app/* → Protected main application routes (dashboard, accounts, admin, inventory)
 * - Default → Redirect to auth/login
 * - /** → Fallback to auth/login
 */

export const routes: Routes = [
  // ====================================
  // ROOT - Redirect to auth/login
  // ====================================
  // { path: '', redirectTo: '/auth/login', pathMatch: 'full' },

  // ====================================
  // AUTH ROUTES - Public (No Guard)
  // ====================================
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },

  // ====================================
  // MAIN APP ROUTES - Protected (With Guard)
  // ====================================
  // All app routes use MainLayout (Header + Sidebar)
  {
    path: 'app/:orgId',
    loadComponent: () => import('./layout/main-layout').then(m => m.MainLayout),

    children: [
      // Modules Management
      {
        path: 'modules',
        data: { title: 'Modules - BizArabia ERP', breadcrumb: 'Modules' },
        loadChildren: () => import('./features/modules/modules.routes').then(m => m.MODULES_ROUTES)
      },

      // Accounts Module
      {
        path: 'accounts',
        data: { breadcrumb: 'Accounts' },
        loadChildren: () => import('./features/accounts/accounts.routes').then(m => m.ACCOUNTS_ROUTES)
      },
      {
        path: "security",
        data: { breadcrumb: "Security" },
        loadChildren: () => import('./features/settings/settings.routes').then(m => m.SETTINGS_ROUTES)
      },

      // Default: Redirect to modules within this org
      { path: '', redirectTo: 'modules', pathMatch: 'full' }
    ]
  },


  // ====================================
  // FALLBACK - 404 Route
  // ====================================
  { path: '**', redirectTo: '/auth/login' }
];


// src/
// ├── app/
// │   ├── core/                  # SINGLETONS (Global Services)
// │   │   ├── auth/              # Auth Guard, Interceptors
// │   │   ├── config/            # App Config, API Endpoints
// │   │   ├── models/            # Global Interfaces (User, APIResponse)
// │   │   └── services/          # Global API Services (HttpWrapper)
// │   │
// │   ├── shared/                # REUSABLE UI (Dumb Components)
// │   │   ├── components/        # app-table-wrapper, app-confirm-dialog
// │   │   ├── directives/        # permissions.directive.ts
// │   │   └── pipes/             # currency-format.pipe.ts
// │   │
// │   ├── features/              # BUSINESS DOMAINS (Lazy Loaded)
// │   │   ├── admin/             # COLLEGE ADMIN DOMAIN
// │   │   │   ├── admissions/
// │   │   │   ├── students/      # Student List, Student Profile
// │   │   │   └── academics/     # Classes, Timetables, Attendance
// │   │   │
// │   │   ├── accounts/          # ACCOUNTS DOMAIN
// │   │   │   ├── fees/          # Fee Collection, Invoicing
// │   │   │   ├── payroll/       # Staff Salaries
// │   │   │   └── ledger/        # General Ledger, Expenses
// │   │   │
// │   │   └── portal/            # STUDENT/PARENT PORTAL
// │   │
// │   ├── layout/                # SHELL
// │   │   ├── sidebar/
// │   │   ├── header/
// │   │   └── main-layout.component.ts
// │   │
// │   └── app.routes.ts          # Root Routing
