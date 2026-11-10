import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, HttpInterceptorFn } from '@angular/common/http';
import { delay } from 'rxjs/operators';
import { routes } from './app.routes';

const delayInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    delay(2000) 
  );
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([delayInterceptor]))
  ]
};
