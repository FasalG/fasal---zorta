import { Component } from '@angular/core';

/**
 * Email Verification Page Component
 * Allows users to verify their email after signup
 */
@Component({
  selector: 'app-verify-email-page',
  standalone: true,
  template: `
    <div class="verify-container">
      <div class="verify-icon">✉️</div>
      <h2>Verify Your Email</h2>
      <p class="subtitle">We've sent a verification link to your email address</p>
      <p class="instruction">Click the link in the email to verify your account and get started</p>
      <a href="/auth/login" class="btn-primary">Back to Login</a>
    </div>
  `,
  styles: [`
    .verify-container {
      text-align: center;
      animation: slideUp 0.5s ease-out;
    }

    .verify-icon {
      font-size: 60px;
      margin-bottom: 20px;
    }

    h2 {
      color: #333;
      margin-bottom: 10px;
      font-size: 24px;
    }

    .subtitle {
      color: #666;
      margin-bottom: 15px;
      font-size: 14px;
    }

    .instruction {
      color: #888;
      margin-bottom: 25px;
      font-size: 14px;
      line-height: 1.6;
    }

    .btn-primary {
      display: inline-block;
      padding: 12px 30px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s;
    }

    .btn-primary:hover {
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
      transform: translateY(-2px);
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
  `]
})
export class VerifyEmailPage {}
