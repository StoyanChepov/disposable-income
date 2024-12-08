import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../environments/environment';

const { BASE_URL } = environment;
const API = '/api';

export const appInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith(API)) {
    req = req.clone({
      url: req.url.replace('/api', BASE_URL),
    });
    /* const auth = localStorage.getItem('auth');
    if (auth) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      });
    }*/
  }

  return next(req);
};
