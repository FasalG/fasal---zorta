import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { tap, catchError, finalize, retry, timeout, map } from 'rxjs/operators';
import { apiBaseUrl } from '../../app.config'; // Ensure this path is correct
import { HttpMethod } from '../enum/httpmethod.enum';
import { CustomSnack, SnackBarType } from '../services/custom-snack';
import { ApiResponse } from '../modals/commonapiresponse';

/**
 * Configuration for HTTP requests
 */
export interface HttpRequestConfig {
  method: HttpMethod;
  endpoint: string;
  params?: Record<string, any>;
  body?: any;
  headers?: Record<string, string>;

  /** Enable request/response logging (default: false) */
  enableLogging?: boolean;

  /** Retry failed requests (default: 1) */
  retryAttempts?: number;

  /** Request timeout in milliseconds (default: 30000) */
  requestTimeout?: number;

  /** * CACHE READ: 
   * If provided, the response will be cached under these tags.
   * Example: ['students', 'class-10']
   */
  cacheTags?: string[];

  /** * CACHE CLEAR: 
   * If provided, ALL cache entries associated with these tags will be deleted before the request runs.
   * Use this for POST/PUT/DELETE to ensure data freshness.
   */
  invalidateTags?: string[];
}

/**
 * Standardized API Response wrapper
 */


@Injectable({
  providedIn: 'root'
})
export class RestService {

  // 1. Stores the actual data: "GET:/api/students?page=1" -> [Student A, Student B]
  private responseCache = new Map<string, any>();

  // 2. Maps Tags to Keys: "students" -> ["GET:/api/students?page=1", "GET:/api/students/101"]
  private cacheTagMap = new Map<string, Set<string>>();

  private requestLog: any[] = [];
  private maxRequestLogs = 100;


  private customSnack = inject(CustomSnack);

  constructor(private http: HttpClient) {
    this.initializeLogging();
  }

  private initializeLogging(): void {
    console.log('[RestService] Initialized with Tag-Based Caching');
  }

  /**
   * Execute HTTP request with Auto-Cache Invalidation
   */
  HttpRequestHandler<T = any>(config: HttpRequestConfig): Observable<T> {

    // console.log(config.body.value,'login')

    // --- STEP 1: INVALIDATE CACHE (Write Operations) ---
    // If we are adding/editing data, clear old cache first
    if (config.invalidateTags && config.invalidateTags.length > 0) {
      this.clearCacheByTags(config.invalidateTags);
    }

    // Generate a unique key for this specific request (URL + Params)
    // Example: "GET:https://api.com/students:{"page":"1"}"
    const uniqueRequestKey = this.generateCacheKey(config);

    // --- STEP 2: CHECK CACHE (Read Operations) ---
    // Only use cache if it's a GET request and cacheTags are provided
    if (config.method === HttpMethod.GET && config.cacheTags && config.cacheTags.length > 0) {
      if (this.responseCache.has(uniqueRequestKey)) {
        if (config.enableLogging) {
          console.log(`[RestService] ⚡ Cache HIT: ${uniqueRequestKey}`);
        }
        return of(this.responseCache.get(uniqueRequestKey));
      }
    }

    // --- STEP 3: PREPARE REQUEST ---
    const url = this.buildUrl(config.endpoint);
    const httpParams = this.buildHttpParams(config.params);

    // Robust check for FormData
    const isFormData = config.body && (config.body instanceof FormData || (typeof config.body.append === 'function' && typeof config.body.delete === 'function'));

    const headers = this.buildHeaders(config.headers, isFormData);
    const requestOptions = { params: httpParams, headers };

    if (config.enableLogging) this.logRequest(config, url, isFormData);

    const retryCount = config.retryAttempts ?? 1;
    const timeoutMs = config.requestTimeout ?? 30000;

    let request$: Observable<ApiResponse<T>>;

    switch (config.method) {
      case HttpMethod.GET:
        request$ = this.http.get<ApiResponse<T>>(url, requestOptions);
        break;
      case HttpMethod.POST:
        request$ = this.http.post<ApiResponse<T>>(url, config.body || {}, requestOptions);
        break;
      case HttpMethod.PUT:
        request$ = this.http.put<ApiResponse<T>>(url, config.body || {}, requestOptions);
        break;
      case HttpMethod.DELETE:
        request$ = this.http.delete<ApiResponse<T>>(url, requestOptions);
        break;
      case HttpMethod.PATCH:
        request$ = this.http.patch<ApiResponse<T>>(url, config.body || {}, requestOptions);
        break;
      default:
        return throwError(() => new Error(`Unsupported HTTP method: ${config.method}`));
    }

    // --- STEP 4: EXECUTE & SAVE TO CACHE ---
    return request$.pipe(
      timeout(timeoutMs),
      retry({ count: retryCount, delay: 1000 }),
      tap(response => {
        if (config.enableLogging) this.logResponse(config, response);

        // --- CENTRALIZED SNACKBAR LOGIC ---
        if (response && (response as any).message) {
          if ((response as any).success) {
            this.customSnack.showNotification(SnackBarType.SUCCESS, (response as any).message);

          } else {
            this.customSnack.showNotification(SnackBarType.ERROR, (response as any).message);

          }
        }

        // If this was a cached request, save the result and link it to the tags
        if (config.method === HttpMethod.GET && config.cacheTags) {
          this.saveToCache(uniqueRequestKey, response, config.cacheTags);
        }
      }),
      map(res => {
        // Automatically unwrap the data if success is true
        if (res && res.success) {
          return res.data as T;
        }
        // If success is false, throw the entire response (including error message)
        throw res;
      }),
      catchError(error => {
        if (config.enableLogging) this.logError(config, error);
        return this.handleError(error);
      }),
      finalize(() => {
        // Optional: Loading spinner logic could go here
      })
    );
  }

  // ==========================================
  //  CACHE MANAGEMENT HELPERS
  // ==========================================

  /**
   * Generates a unique string key based on Method, URL, and Params
   */
  private generateCacheKey(config: HttpRequestConfig): string {
    const paramString = config.params ? JSON.stringify(config.params) : '';
    return `${config.method}:${config.endpoint}:${paramString}`;
  }

  /**
   * Saves response to cache and maps it to the provided tags
   */
  private saveToCache(key: string, response: any, tags: string[]) {
    // 1. Save data
    this.responseCache.set(key, response);

    // 2. Link tags
    tags.forEach(tag => {
      if (!this.cacheTagMap.has(tag)) {
        this.cacheTagMap.set(tag, new Set<string>());
      }
      this.cacheTagMap.get(tag)?.add(key);
    });
  }

  /**
   * Clears all cache entries associated with the given tags
   */
  private clearCacheByTags(tags: string[]) {
    tags.forEach(tag => {
      const keysToDelete = this.cacheTagMap.get(tag);

      if (keysToDelete) {
        keysToDelete.forEach(key => {
          this.responseCache.delete(key);
          console.log(`[Cache] 🗑️ Invalidated: ${key} (via tag: ${tag})`);
        });
        // Remove the tag entry itself
        this.cacheTagMap.delete(tag);
      }
    });
  }

  /**
   * Manually clear entire cache (e.g., on Logout)
   */
  clearAllCache() {
    this.responseCache.clear();
    this.cacheTagMap.clear();
    console.log('[Cache] Wiped clean.');
  }

  // ==========================================
  //  STANDARD HELPERS (URL, Headers, Error)
  // ==========================================

  private buildUrl(endpoint: string): string {
    return endpoint.startsWith('http') ? endpoint : `${apiBaseUrl}${endpoint}`;
  }

  private buildHttpParams(params?: Record<string, any>): HttpParams {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key];
        if (value !== null && value !== undefined && value !== '') {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }
    return httpParams;
  }

  private buildHeaders(customHeaders?: Record<string, string>, isFormData: boolean = false): HttpHeaders {
    // Don't set Content-Type for FormData - let the browser set it with correct boundary
    let httpHeaders = isFormData ? new HttpHeaders() : new HttpHeaders({ 'Content-Type': 'application/json' });
    if (customHeaders) {
      Object.keys(customHeaders).forEach(key => httpHeaders = httpHeaders.set(key, customHeaders[key]));
    }
    return httpHeaders;
  }

  private handleError(error: HttpErrorResponse | any): Observable<never> {
    // Construct standard error object
    const errorResponse: ApiResponse = {
      success: false,
      statusCode: error.status || 500,
      error: error.error?.message || error.message || 'Unknown Error',
      timestamp: new Date()
    };
    return throwError(() => errorResponse);
  }

  // ==========================================
  //  LOGGING HELPERS
  // ==========================================

  private logRequest(config: HttpRequestConfig, url: string, isFormData: boolean = false): void {
    console.groupCollapsed(`[Rest] ↗️ ${config.method} ${config.endpoint}`);
    console.log('URL:', url);
    console.log('Params:', config.params);

    if (isFormData && config.body) {
      const bodyObj: Record<string, any> = {};
      (config.body as FormData).forEach((value, key) => {
        bodyObj[key] = value;
      });
      console.log('Body (FormData):', bodyObj);
    } else {
      console.log('Body:', config.body);
    }

    console.groupEnd();
  }

  private logResponse(config: HttpRequestConfig, response: any): void {
    console.groupCollapsed(`[Rest] ↙️ ${config.method} ${config.endpoint} (Success)`);
    console.log('Data:', response);
    console.groupEnd();
  }

  private logError(config: HttpRequestConfig, error: any): void {
    console.error(`[Rest] ❌ ${config.method} ${config.endpoint} Failed`, error);
  }
}