import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../api-services/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor(private auth: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    if (!this.isBrowser) {
      return true; // Allow rendering on server to prevent pre-emptive redirect
    }

    const userSignal = this.auth.currentUser;
    const user = userSignal();
    if (user) return true;
    return this.router.createUrlTree(['auth/login'], { queryParams: { returnUrl: state.url } });
  }
}
