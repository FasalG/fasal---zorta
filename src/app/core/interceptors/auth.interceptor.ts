import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../api-services/auth/auth.service';
import { Router } from '@angular/router';
import { OrgContextService } from '../services/org-context.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const orgContext = inject(OrgContextService);
  const router = inject(Router);

  // Get token and orgId from signals
  const token = authService.currentToken();
  // const orgId = orgContext.currentOrgId();

  console.log(token, 'token')

  console.log('[AuthInterceptor] Intercepting request:', req.url);

  // Clone headers
  let headers = req.headers;

  // Add standard Authorization header
  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }

  // Auto-inject Organization context (X-Company-ID) if available
  // This makes our services "org-aware" without manual effort in every call
  // if (orgId) {
  //   headers = headers.set('X-Company-ID', orgId.toString());
  // }

  const authReq = req.clone({ headers });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.warn('[AuthInterceptor] 401 Unauthorized detected. Logging out...');
        // authService.logout();
        // router.navigate(['auth/login']);
      }
      return throwError(() => error);
    })
  );
};

