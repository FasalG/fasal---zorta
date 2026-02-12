import { APP_INITIALIZER, ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export let apiBaseUrl: string;

/**
 * Load configuration from assets/config.json
 */
export function loadConfig(http: HttpClient) {
  return () => firstValueFrom(
    http.get<any>('/assets/config.json').pipe(
      timeout(5000)
    )
  ).then(config => {
    apiBaseUrl = config.apiBaseUrl;
  }).catch(error => {
    console.warn('Failed to load config.json, using defaults', error);
    apiBaseUrl = 'https://localhost:5001';
  });
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),

    // Modern Functional Interceptors
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor])
    ),

    {
      provide: APP_INITIALIZER,
      useFactory: loadConfig,
      deps: [HttpClient],
      multi: true
    }
  ]
};

