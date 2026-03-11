import { Injectable, signal, inject } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { ApiService } from '../core/services/api.service';
import { Endpoints } from '../core/constants/endpoints';
import { HttpMethod } from '../core/enums/httpmethod.enum';

export interface CompanyDetails {
    name: string;
    address?: string;
    phone?: string;
    gst_number?: string;
}

export interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    companyDetails?: CompanyDetails;
}

export interface AuthResponse {
    token: string;
    user: User;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private api = inject(ApiService);

    // Reactive state using Signals
    currentUser = signal<User | null>(this.getStoredUser());
    isAuthenticated = signal<boolean>(this.hasToken());

    constructor() { }

    login(credentials: any): Observable<AuthResponse> {
        return this.api.HttpRequestHandler<AuthResponse>({
            method: HttpMethod.POST,
            endpoint: Endpoints.AUTH.LOGIN,
            body: credentials
        }).pipe(
            tap(response => {
                this.setSession(response);
            }),
            catchError(error => {
                return throwError(() => error);
            })
        );
    }

    logout() {
        localStorage.removeItem('zorta_token');
        localStorage.removeItem('zorta_user');
        this.currentUser.set(null);
        this.isAuthenticated.set(false);
        this.api.clearAllCache();
    }

    getToken(): string | null {
        return localStorage.getItem('zorta_token');
    }

    private setSession(authResult: AuthResponse) {
        // Fallback for company name if not provided by backend
        if (authResult.user && (!authResult.user.companyDetails || !authResult.user.companyDetails.name)) {
            authResult.user.companyDetails = {
                ...authResult.user.companyDetails,
                name: 'soberdosis'
            };
        }

        localStorage.setItem('zorta_token', authResult.token);
        localStorage.setItem('zorta_user', JSON.stringify(authResult.user));
        this.currentUser.set(authResult.user);
        this.isAuthenticated.set(true);
    }

    private getStoredUser(): User | null {
        try {
            const user = localStorage.getItem('zorta_user');
            return user ? JSON.parse(user) : null;
        } catch (e) {
            console.error('Error parsing stored user data, clearing storage:', e);
            localStorage.removeItem('zorta_user');
            localStorage.removeItem('zorta_token');
            return null;
        }
    }

    private hasToken(): boolean {
        return !!localStorage.getItem('zorta_token');
    }
}
