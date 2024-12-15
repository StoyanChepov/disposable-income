import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap, throwError } from 'rxjs';
import { User, UserForAuth } from '../types/user';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user$$ = new BehaviorSubject<UserForAuth | null>(null);
  private user$ = this.user$$.asObservable();

  user: UserForAuth | null = null;
  get isLogged(): boolean {
    return !!this.user;
  }

  constructor(private http: HttpClient) {
    this.user$.subscribe((user) => (this.user = user));
  }

  login(email: string, password: string) {
    return this.http
      .post<UserForAuth>('/api/users/login', { email, password })
      .pipe(
        tap((user) => this.user$$.next(user)),
        catchError((error) => {
          console.error('Login failed:', error.message || error);
          return throwError(() => new Error('Login failed. Please try again.'));
        })
      );
  }

  register(email: string, password: string, rePassword: string) {
    return this.http
      .post<UserForAuth>('/api/users/register', {
        email,
        password,
        repass: rePassword,
      })
      .pipe(
        tap((user) => this.user$$.next(user)),
        catchError((error) => {
          console.error('Registration failed:', error.message || error);
          return throwError(
            () => new Error('Registration failed. Please try again.')
          );
        })
      );
  }

  logout() {
    this.user = null;
    return this.http
      .get('/api/users/logout', {})
      .pipe(tap((user) => this.user$$.next(null)));
  }

  get isAuthenticated() {
    return this.http
      .get<UserForAuth>('/api/users/profile')
      .pipe(tap((user) => this.user$$.next(user)));
  }
}
