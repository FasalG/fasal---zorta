import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/api-services/auth/auth.service';
import { FormFieldWrapperComponent } from '../../../shared/components/form-field-wrapper/form-field-wrapper.component';
import { MatSelectModule } from '@angular/material/select';
import { Company } from '../auth.interfaces';
import { DropdownComponent } from '../../../shared/components/dropdown/dropdown.component';

/**
 * Login Page Component
 * 
 * Authenticates users with email and password
 * Includes form validation and error handling
 * Responsive design that fits in viewport without scrolling
 */
@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormFieldWrapperComponent, MatSelectModule, DropdownComponent],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;
  errorMessage = '';
  companies: Company[] = [];

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  constructor() {
    this.loginForm = this.fb.group({
      companyId: [null, [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    this.fetchCompanies();
  }

  /**
   * Fetch companies via AuthService (Intermediary for RestService)
   */
  private fetchCompanies() {
    this.authService.getCompanies(0).subscribe({
      next: (response: Company[]) => {
        // Access data from ApiResponse structure
        this.companies = response;
        if (this.companies && this.companies.length > 0) {
          this.loginForm.patchValue({ companyId: this.companies[0].companyID });
        }
      },
      error: (err) => {
        console.error('Failed to load companies', err);
        this.errorMessage = 'Failed to load company list. Please Contact Support.';
      }
    });
  }

  /**
   * Toggle password visibility
   */
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  /**
   * Get getters for form fields
   */
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
  get companyId() { return this.loginForm.get('companyId'); }

  /**
   * Handle login form submission
   */
  onLogin() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please fill in all fields correctly';
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { email, password, companyId } = this.loginForm.value;

    this.authService.doLogin(email, password, companyId).subscribe({
      next: (data) => {
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;

        console.error('Login error', err);
      }
    });
  }

  /**
   * Navigation helpers
   */
  goToForgotPassword() {
    this.router.navigate(['/auth/forgot-password']);
  }

  goToNewInquiry() {
    this.router.navigate(['/inquiry']);
  }

  goToOPAC() {
    window.open('https://opac.example.com', '_blank');
  }
}
