import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Auth Layout Component
 * 
 * Shared wrapper for all authentication pages (login, signup, forgot-password, verify-email)
 * Provides consistent styling, branding, header, and footer for all auth pages
 * 
 * Child Routes: /auth/login, /auth/signup, /auth/forgot-password, /auth/verify-email
 */
@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <!-- <div class="auth-container"> -->
      <!-- Auth Header / Branding -->
      <!-- <div class="auth-header">
        <div class="logo-section">
          <img src="assets/logo.png" alt="BizArabia" class="logo" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect fill=%22%23667eea%22 width=%22100%22 height=%22100%22/%3E%3Ctext fill=%22white%22 x=%2250%22 y=%2260%22 text-anchor=%22middle%22 font-size=%2240%22 font-weight=%22bold%22%3EBA%3C/text%3E%3C/svg%3E'">
          <div class="brand-text">
            <h1>BizArabia</h1>
            <p>Enterprise ERP System</p>
          </div>
        </div>
      </div>  -->

      <!-- Auth Content (Dynamic - Routed Pages) -->
      <!-- <div class="auth-content"> -->
        <router-outlet></router-outlet>
      <!-- </div> -->

      <!-- Auth Footer -->
      <!-- <div class="auth-footer">
        <p>&copy; 2025 BizArabia. All rights reserved.</p>
        <div class="footer-links">
          <a href="#privacy" target="_blank">Privacy Policy</a>
          <span class="separator">•</span>
          <a href="#terms" target="_blank">Terms of Service</a>
          <span class="separator">•</span>
          <a href="#support" target="_blank">Support</a>
        </div>
      </div> -->
    <!-- </div> -->
  `,
  styles: []
})
export class AuthLayoutComponent {}
