import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './auth-layout.component';
import { LoginPage } from './login-page/login-page';

/**
 * AUTH FEATURE ROUTES
 * 
 * All auth-related routes (login, signup, forgot-password, etc.)
 * Wrapped in AuthLayoutComponent for consistent styling
 * 
 * Usage: /auth/login, /auth/signup, /auth/forgot-password
 */
export const AUTH_ROUTES: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      // Default: Redirect to login
      { path: '', redirectTo: 'login', pathMatch: 'full' },

      // Login Page
      {
        path: 'login',
        component: LoginPage,
        data: { title: 'Login - BizArabia ERP' }
      },

      // Signup Page (Future)
      {
        path: 'signup',
        loadComponent: () =>
          import('./signup-page/signup-page').then(m => m.SignupPage),
        data: { title: 'Sign Up - BizArabia ERP' }
      },

      // Forgot Password Page (Future)
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./forgot-password-page/forgot-password-page').then(m => m.ForgotPasswordPage),
        data: { title: 'Forgot Password - BizArabia ERP' }
      },

      // Email Verification Page (Future)
      {
        path: 'verify-email',
        loadComponent: () =>
          import('./verify-email-page/verify-email-page').then(m => m.VerifyEmailPage),
        data: { title: 'Verify Email - BizArabia ERP' }
      }
    ]
  }
];
