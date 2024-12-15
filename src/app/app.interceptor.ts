import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

const { BASE_URL } = environment;
const API = '/api';

export const appInterceptor: HttpInterceptorFn = (req, next) => {
  // Function to check if a cookie with the given name exists
  const hasCookie = (cookieName: string) => {
    return document.cookie
      .split('; ')
      .some((cookie) => cookie.startsWith(`${cookieName}=`));
  };

  // Check if the 'name' cookie exists
  if (
    !hasCookie('token') &&
    req.url !== '/api/users/login' &&
    req.url !== '/api/users/register'
  ) {
    console.warn('No "token" cookie found. Request blocked:', req.url);
    // Prevent the request by returning an error observable
    return throwError(
      () => new Error('Request blocked: No "token" cookie found.')
    );
  }

  // Modify the request if it starts with API
  if (req.url.startsWith(API)) {
    req = req.clone({
      url: req.url.replace(API, BASE_URL),
      withCredentials: true,
    });
  }

  return next(req).pipe(
    // Handle errors
    catchError((error) => {
      console.error(`Error in request to ${req.url}:`, error);
      return throwError(
        () => new Error('An error occurred while processing the request.')
      );
    })
  );
};
