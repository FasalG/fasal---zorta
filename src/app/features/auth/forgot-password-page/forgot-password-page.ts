import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

/**
 * Forgot Password Page Component
 * Allows users to reset their password
 */
@Component({
  selector: 'app-forgot-password-page',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <form (ngSubmit)="onSubmit()">
      <h2>Reset Password</h2>
      <p class="subtitle">Enter your email to receive password reset instructions</p>

      <div *ngIf="!resetSent" class="email-form">
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

        <button type="submit" class="btn-primary" [disabled]="loading">
          {{ loading ? 'Sending...' : 'Send Reset Link' }}
        </button>
      </div>

      <div *ngIf="resetSent" class="success-message">
        <div class="success-icon">✓</div>
        <h3>Check Your Email</h3>
        <p>We've sent password reset instructions to:</p>
        <p class="email-display">{{ email }}</p>
        <p class="instruction">
          Follow the link in the email to reset your password.
          The link will expire in 24 hours.
        </p>
      </div>

      <div class="form-links">
        <a routerLink="/auth/login">Back to Login</a>
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
      line-height: 1.5;
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

    .success-message {
      text-align: center;
      animation: slideUp 0.5s ease-out;
    }

    .success-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 60px;
      background: #e8f5e9;
      border-radius: 50%;
      font-size: 32px;
      color: #4caf50;
      margin-bottom: 20px;
    }

    .success-message h3 {
      color: #333;
      margin-bottom: 10px;
      font-size: 20px;
    }

    .success-message p {
      color: #666;
      font-size: 14px;
      margin: 8px 0;
      line-height: 1.6;
    }

    .email-display {
      background: #f5f5f5;
      padding: 12px;
      border-radius: 4px;
      font-weight: 600;
      color: #333;
      margin: 15px 0;
    }

    .instruction {
      background: #fffde7;
      border-left: 4px solid #fbc02d;
      padding: 12px;
      margin: 20px 0;
      border-radius: 4px;
      color: #f57f17;
    }

    .form-links {
      margin-top: 25px;
      text-align: center;
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

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 600px) {
      h2 {
        font-size: 22px;
      }

      .success-icon {
        width: 50px;
        height: 50px;
        font-size: 28px;
      }
    }
  `]
})
export class ForgotPasswordPage {
  email = '';
  loading = false;
  resetSent = false;

  onSubmit() {
    this.loading = true;
    // TODO: Call AuthService.forgotPassword()
    console.log('Forgot password for:', this.email);

    setTimeout(() => {
      this.loading = false;
      this.resetSent = true;
    }, 1500);
  }
}
