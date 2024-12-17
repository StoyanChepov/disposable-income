import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { UserForAuth } from '../types/user';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user$$ = new BehaviorSubject<UserForAuth | null>(this.getStoredUser());
  user$ = this.user$$.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Getter for logged-in status
   */
  get isLogged(): boolean {
    return !!this.user$$.value;
  }

  /**
   * Login method
   */
  login(email: string, password: string): Observable<UserForAuth> {
    return this.http
      .post<UserForAuth>('/api/users/login', { email, password })
      .pipe(
        tap((user) => this.setUser(user)),
        catchError((error) => this.handleError('Login failed', error))
      );
  }

  /**
   * Register method
   */
  register(
    email: string,
    password: string,
    rePassword: string
  ): Observable<UserForAuth> {
    return this.http
      .post<UserForAuth>('/api/users/register', {
        email,
        password,
        repass: rePassword,
      })
      .pipe(
        tap((user) => this.setUser(user)),
        catchError((error) => this.handleError('Registration failed', error))
      );
  }

  /**
   * Logout method
   */
  logout(): Observable<void> {
    return this.http.get<void>('/api/users/logout').pipe(
      tap(() => this.clearUser()),
      catchError((error) => this.handleError('Logout failed', error))
    );
  }

  /**
   * Check if the user is authenticated
   */
  isAuthenticated(): Observable<UserForAuth> {
    return this.http.get<UserForAuth>('/api/users/profile').pipe(
      tap((user) => this.setUser(user)),
      catchError((error) => this.handleError('User is not authenticated', error))
    );
  }

  /**
   * Set user state and persist to localStorage
   */
  private setUser(user: UserForAuth | null): void {
    this.user$$.next(user);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }

  /**
   * Retrieve user state from localStorage
   */
  private getStoredUser(): UserForAuth | null {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  }

  /**
   * Clear user state
   */
  private clearUser(): void {
    this.user$$.next(null);
    localStorage.removeItem('user');
  }

  /**
   * Handle HTTP errors
   */
  private handleError(message: string, error: any) {
    console.error(`${message}:`, error.message || error);
    return throwError(() => new Error(`${message}. Please try again.`));
  }
}
