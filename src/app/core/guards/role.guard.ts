import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthService } from '../api-services/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const requiredRoles: string[] = route.data?.['roles'] ?? [];
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const hasAny = requiredRoles.some(r => this.auth.hasRole(r));
    if (hasAny) return true;

    return this.router.createUrlTree(['/access-denied']);
  }
}
