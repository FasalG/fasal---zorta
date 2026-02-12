import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

/**
 * Signup Page Component
 * Allows new users to create an account
 */
@Component({
  selector: 'app-signup-page',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <form (ngSubmit)="onSignup()">
      <h2>Create Account</h2>
      <p class="subtitle">Join BizArabia ERP System</p>

      <div class="form-group">
        <label for="username">Username</label>
        <input
          id="username"
          type="text"
          [(ngModel)]="username"
          name="username"
          class="form-control"
          placeholder="Choose a username"
          required
        >
      </div>

      <div class="form-group">
        <label for="email">Email Address</label>
        <input
          id="email"
          type="email"
          [(ngModel)]="email"
          name="email"
          class="form-control"
          placeholder="your@email.com"
          required
        >
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input
          id="password"
          type="password"
          [(ngModel)]="password"
          name="password"
          class="form-control"
          placeholder="Enter password (min 8 characters)"
          required
        >
      </div>

      <div class="form-group">
        <label for="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          [(ngModel)]="confirmPassword"
          name="confirmPassword"
          class="form-control"
          placeholder="Confirm password"
          required
        >
      </div>

      <div class="form-group">
        <label for="companyId">Company ID</label>
        <input
          id="companyId"
          type="number"
          [(ngModel)]="companyId"
          name="companyId"
          class="form-control"
          placeholder="Enter your company ID"
          required
        >
      </div>

      <button type="submit" class="btn-primary" [disabled]="loading">
        {{ loading ? 'Creating Account...' : 'Sign Up' }}
      </button>

      <div class="form-links">
        <p>Already have an account?
          <a routerLink="/auth/login">Login here</a>
        </p>
      </div>
    </form>
  `,
  styles: [`
    form {
      width: 100%;
    }

    h2 {
      text-align: center;
      margin-bottom: 10px;
      color: #333;
      font-size: 24px;
    }

    .subtitle {
      text-align: center;
      color: #888;
      margin-bottom: 25px;
      font-size: 14px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    label {
      display: block;
      margin-bottom: 6px;
      font-weight: 600;
      color: #555;
      font-size: 14px;
    }

    .form-control {
      width: 100%;
      padding: 11px 12px;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      font-size: 14px;
      transition: border-color 0.3s, box-shadow 0.3s;
      box-sizing: border-box;
    }

    .form-control:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .btn-primary {
      width: 100%;
      padding: 12px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      margin-top: 10px;
    }

    .btn-primary:hover:not(:disabled) {
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
      transform: translateY(-2px);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .form-links {
      margin-top: 20px;
      text-align: center;
      font-size: 14px;
      color: #666;
    }

    .form-links a {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.3s;
    }

    .form-links a:hover {
      color: #764ba2;
      text-decoration: underline;
    }

    @media (max-width: 600px) {
      h2 {
        font-size: 22px;
      }

      .form-control {
        padding: 10px;
      }
    }
  `]
})
export class SignupPage {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  companyId = 0;
  loading = false;

  onSignup() {
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    this.loading = true;
    // TODO: Call AuthService.signup()
    console.log('Signup:', { 
      username: this.username, 
      email: this.email, 
      companyId: this.companyId 
    });

    setTimeout(() => {
      this.loading = false;
    }, 2000);
  }
}
