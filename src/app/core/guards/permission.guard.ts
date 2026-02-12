import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthService } from '../api-services/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class PermissionGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const requiredPermissions: string[] = route.data?.['permissions'] ?? [];
    if (!requiredPermissions || requiredPermissions.length === 0) return true;

    const hasAll = requiredPermissions.every(p => this.auth.hasPermission(p));
    if (hasAll) return true;

    return this.router.createUrlTree(['/access-denied']);
  }
}
