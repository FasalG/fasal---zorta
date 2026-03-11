import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-page-container">
      <div class="glass-morph-card overflow-hidden">
        <div class="row g-0 h-100">
          
          <!-- LEFT SIDE: BRANDING & CINEMA VIBE -->
          <div class="col-lg-6 d-none d-lg-flex flex-column justify-content-between p-5 branding-panel position-relative overflow-hidden">
            <div class="panel-overlay"></div>
            
            <div class="top-brand position-relative" style="z-index: 2;">
              <div class="brand-logo-container mb-3 d-flex align-items-center gap-3">
                <div class="logo-icon-box">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                    <circle cx="12" cy="13" r="4"></circle>
                  </svg>
                </div>
                <div>
                  <h1 class="h2 fw-black mb-0 tracking-tight text-white mt-2">SOBERDOSIS</h1>
                  <p class="brand-subtitle text-uppercase text-white-50 small tracking-widest mb-0">Elite Cinematography</p>
                </div>
              </div>
            </div>

            <div class="mid-branding position-relative" style="z-index: 2;">
              <h2 class="display-5 fw-bold text-white mb-3">The New Standard <br>in <span class="text-indigo-400">Film Rental</span></h2>
              <p class="text-white-50 lead fs-6 opacity-75">Professional grade inventory management for creators, production houses, and equipment managers.</p>
              
              <div class="feature-badges d-flex gap-2 mt-4">
                <span class="badge border border-white-10 bg-white-5 rounded-pill px-3 py-2 fw-medium">8K Ready</span>
                <span class="badge border border-white-10 bg-white-5 rounded-pill px-3 py-2 fw-medium">Smart Stock</span>
                <span class="badge border border-white-10 bg-white-5 rounded-pill px-3 py-2 fw-medium">Pro Floor</span>
              </div>
            </div>

            <div class="bottom-branding position-relative" style="z-index: 2;">
              <div class="system-status-pill">
                <span class="status-dot pulse"></span>
                <span class="small fw-semibold text-white-50">PRODUCTION SYSTEM v4.2 SECURE</span>
              </div>
              <p class="mt-3 text-white-50 smaller mb-0">© 2026 SOBERDOSIS GLOBAL. ALL RIGHTS RESERVED.</p>
            </div>
          </div>

          <!-- RIGHT SIDE: LOGIN FORM -->
          <div class="col-lg-6 d-flex align-items-center justify-content-center p-4 p-md-5 bg-form-panel">
            <div class="form-wrapper w-100" style="max-width: 400px;">
              <div class="text-left mb-5">
                <div class="d-lg-none mb-4">
                  <h2 class="h3 fw-bold text-white mb-0">SOBERDOSIS</h2>
                  <p class="text-white-50 small">Management Suite</p>
                </div>
                <h3 class="h2 fw-bold text-white mb-2">Access Portal</h3>
                <p class="text-white-50">Authorization required to access the vault.</p>
              </div>

              <div *ngIf="error" class="alert alert-nextgen-err mb-4" role="alert">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="me-2"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                {{ error }}
              </div>

              <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                <div class="mb-4">
                  <label class="form-label-nextgen">RESOURCE ID (EMAIL)</label>
                  <div class="input-container-nextgen position-relative">
                    <input type="email" class="input-nextgen" formControlName="email" placeholder="name@soberdosis.com">
                    <svg class="input-icon-nextgen" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>

                <div class="mb-5">
                  <div class="d-flex justify-content-between">
                    <label class="form-label-nextgen">AUTHENTICATION KEY</label>
                    <a href="#" class="text-indigo-400 smaller text-decoration-none hover-glow" (click)="$event.preventDefault()">Reset Key</a>
                  </div>
                  <div class="input-container-nextgen position-relative">
                    <input type="password" class="input-nextgen" formControlName="password" placeholder="••••••••••••">
                    <svg class="input-icon-nextgen" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>

                <button type="submit" [disabled]="loading" class="btn-nextgen-submit w-100 py-3 d-flex align-items-center justify-content-center gap-3">
                  <span *ngIf="loading" class="spinner-grow spinner-grow-sm" role="status"></span>
                  <span class="fw-bold tracking-widest">{{ loading ? 'VERIFYING...' : 'INITIATE SESSION' }}</span>
                  <svg *ngIf="!loading" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { --primary: #6366f1; --accent: #a855f7; }

    .login-page-container {
      min-height: 100vh;
      background: #020617;
      background-image: radial-gradient(circle at top right, rgba(99, 102, 241, 0.15), transparent),
                        radial-gradient(circle at bottom left, rgba(168, 85, 247, 0.1), transparent);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      font-family: 'Outfit', 'Inter', sans-serif;
    }

    .glass-morph-card {
      width: 100%;
      max-width: 1100px;
      height: 700px;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 2.5rem;
      box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.8);
    }

    .branding-panel {
      background: #000;
      position: relative;
    }

    .panel-overlay {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background-image: linear-gradient(to bottom, rgba(0,0,0,0.4), #000 90%), url('/assets/images/login-bg.png');
      background-size: cover;
      background-position: center;
      opacity: 0.8;
      z-index: 1;
    }

    .logo-icon-box {
      width: 54px;
      height: 54px;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3);
    }

    .bg-white-5 { background: rgba(255, 255, 255, 0.05); }
    .border-white-10 { border-color: rgba(255, 255, 255, 0.1) !important; }
    .text-indigo-400 { color: #818cf8 !important; }

    .system-status-pill {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.05);
      padding: 8px 16px;
      border-radius: 100px;
    }

    .status-dot { width: 8px; height: 8px; background: #10b981; border-radius: 50%; box-shadow: 0 0 10px #10b981; }
    .pulse { animation: pulse-animation 2s infinite; }
    @keyframes pulse-animation { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.4); } 100% { opacity: 1; transform: scale(1); } }

    .bg-form-panel { background: rgba(255, 255, 255, 0.01); }

    .form-label-nextgen {
      display: block;
      color: rgba(255, 255, 255, 0.4);
      font-size: 0.7rem;
      font-weight: 800;
      letter-spacing: 2px;
      margin-bottom: 12px;
    }

    .input-nextgen {
      width: 100%;
      background: rgba(255, 255, 255, 0.03) !important;
      border: 1px solid rgba(255, 255, 255, 0.08) !important;
      border-radius: 16px;
      padding: 16px 20px 16px 52px;
      color: white !important;
      font-size: 1rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .input-nextgen:focus {
      outline: none;
      background: rgba(255, 255, 255, 0.06) !important;
      border-color: var(--primary) !important;
      box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.15);
    }

    .input-icon-nextgen {
      position: absolute;
      left: 18px;
      top: 50%;
      transform: translateY(-50%);
      color: rgba(255, 255, 255, 0.2);
      transition: color 0.3s ease;
    }

    .input-nextgen:focus + .input-icon-nextgen { color: var(--primary); }

    .btn-nextgen-submit {
      background: linear-gradient(135deg, var(--primary), var(--accent));
      border: none;
      border-radius: 18px;
      color: white;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    .btn-nextgen-submit:hover:not(:disabled) {
      transform: translateY(-3px);
      box-shadow: 0 20px 40px -10px rgba(99, 102, 241, 0.5);
    }

    .btn-nextgen-submit:active { transform: translateY(0); }

    .alert-nextgen-err {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
      color: #fca5a5;
      border-radius: 16px;
      display: flex;
      align-items: center;
      padding: 12px 20px;
    }

    .smaller { font-size: 0.75rem; }
    .fw-black { font-weight: 900; }
    .tracking-tight { letter-spacing: -1px; }
    .hover-glow:hover { text-shadow: 0 0 10px rgba(129, 140, 248, 0.5); color: white !important; }
  `]
})
export class LoginComponent {
  private formBuilder = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  loading = false;
  submitted = false;
  error = '';
  returnUrl = '';

  constructor() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.error = '';

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    const credentials = {
      email: this.f.email.value,
      password: this.f.password.value
    };

    this.authService.login(credentials).subscribe({
      next: () => {
        this.router.navigateByUrl(this.returnUrl);
      },
      error: (error) => {
        this.error = error.error?.message || 'Verification failed. Access Denied.';
        this.loading = false;
      }
    });
  }
}
