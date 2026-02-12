import { Injectable, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { tap, Observable } from 'rxjs';
import { LocalStorageService } from '../../services/localstorage.service';
import { decodeJWT } from '../../helper-functions/encrypt-decrypt';
import { HttpMethod } from '../../enum/httpmethod.enum';
import { Endpoints, MicroServices } from '../../constants/urls';
import { GetFormData } from '../../helper-functions/helper-functions-others';
import { UserResponse } from '../../modals/auth.model';
import { Company } from '../../../features/auth/auth.interfaces';
import { RestService } from '../api.service';



@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private localstorage = inject(LocalStorageService);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private RestService = inject(RestService);

  // --- SIGNALS ---
  // We initialize directly from our secure storage service
  private currentUserSignal = signal<UserResponse | null>(this.localstorage.getItem<UserResponse>('current_user'));
  private tokenSignal = signal<string | null>(this.localstorage.getItem<string>('auth_token'));

  // --- COMPUTED ---
  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly currentToken = this.tokenSignal.asReadonly();
  readonly isLoggedIn = computed(() => !!this.tokenSignal());

  private logoutTimer?: any;

  constructor() {
    // On app load, if we have a token, start the expiration timer
    const token = this.tokenSignal();
    // if (token) {
    //   this.setExpirationTimer(token);
    // }
  }

  // --- PERMISSION CHECKS ---
  hasRole(role: string): boolean {
    // return this.currentUserSignal()?.roles.includes(role) ?? false;
    return true;
  }

  hasPermission(permission: string): boolean {
    // return this.currentUserSignal()?.permissions.includes(permission) ?? false;
    return true;
  }

  // --- CORE ACTIONS ---
  getCompanies(loginUserId: number): Observable<Company[]> {
    return this.RestService.HttpRequestHandler<any[]>({
      method: HttpMethod.POST,
      endpoint: Endpoints.ACCOUNTS.COMPANY.GET_COMPANIES,
      params: { LoginUserId: loginUserId },
      cacheTags: ['companies'],
      enableLogging: true
    });
  }

  doLogin(username: string, password: string, companyId: number): Observable<any> {

    const formData = new FormData();
    formData.append('Username', username);
    formData.append('Password', password);
    formData.append('CompanyID', companyId.toString());

    return this.RestService.HttpRequestHandler({
      method: HttpMethod.POST,
      endpoint: Endpoints.AUTH_LOGIN,
      body: formData
    }).pipe(
      tap({
        next: (user: UserResponse) => {
          console.log(user, 'user')
          // setItem handles encryption via your LocalStorageService
          this.localstorage.setItem('auth_token', user?.accessToken);
          this.localstorage.setItem('current_user', user);

          // Update Signals
          this.tokenSignal.set(user?.accessToken ?? null);
          this.currentUserSignal.set(user ?? null);

          // this.setExpirationTimer(user.accessToken);
          this.router.navigate(['app', companyId, 'modules']);
        },

        error: (err) => {
          console.log(err);
        }
      })
    );
  }

  // return user as unknown as Observable<User>;







  // return this.http.post<any>('/authentication', formData).pipe(
  //   tap(response => {
  //     const user: User = {
  //       id: response.userId,
  //       username: response.username,
  //       email: response.email,
  //       roles: response.roles || [],
  //       permissions: response.permissions || [],
  //       companyId: response.companyId
  //     };


  //   })
  // );

  logout(): void {
    if (this.logoutTimer) clearTimeout(this.logoutTimer);

    this.localstorage.removeItem('auth_token');
    this.localstorage.removeItem('current_user');

    this.currentUserSignal.set(null);
    this.tokenSignal.set(null);

    this.router.navigate(['/auth/login'], { replaceUrl: true });

  }

  // --- SECURITY: TOKEN EXPIRATION ---
  private setExpirationTimer(token: string) {
    if (!this.isBrowser) return;

    try {
      const decoded = decodeJWT(token);
      if (decoded?.exp) {
        const expirationDate = decoded.exp * 1000;
        const timeout = expirationDate - Date.now();

        if (this.logoutTimer) clearTimeout(this.logoutTimer);

        if (timeout > 0) {
          this.logoutTimer = setTimeout(() => this.logout(), timeout);
        } else {
          this.logout(); // Already expired
        }
      }
    } catch (e) {
      console.error('Invalid Token Format', e);
    }
  }



  private selectedModuleIdSignal = signal<number>(this.localstorage.getItem<number>('selected_module_id') ?? 1);
  readonly selectedModuleId = this.selectedModuleIdSignal.asReadonly();

  setSelectedModule(id: number) {
    this.localstorage.setItem('selected_module_id', id);
    this.selectedModuleIdSignal.set(id);
  }

  private selectedModuleNameSignal = signal<string>(this.localstorage.getItem<string>('selected_module_name') ?? '');
  readonly selectedModuleName = this.selectedModuleNameSignal.asReadonly();

  setSelectedModuleName(name: string) {
    this.localstorage.setItem('selected_module_name', name);
    this.selectedModuleNameSignal.set(name);
  }

  GetSideMenu() {
    return this.RestService.HttpRequestHandler({
      method: HttpMethod.POST,
      endpoint: Endpoints.ADMIN.UserRights,
      params: {
        LoginUserID: 1,
        ModuleID: this.selectedModuleId(),
        IsNative: 'yes',
        Culture: 'en-US'
      },

    })
  }



}