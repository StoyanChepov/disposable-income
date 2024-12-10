import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../environments/environment';

const { BASE_URL } = environment;
const API = '/api';

export const appInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith(API)) {
    req = req.clone({
      url: req.url.replace(API, BASE_URL),
      withCredentials: true,
    });
  }

  return next(req);
};
