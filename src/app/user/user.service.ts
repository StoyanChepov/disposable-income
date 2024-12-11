import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { User, UserForAuth } from '../types/user';

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
      .pipe(tap((user) => this.user$$.next(user)));
  }

  register(email: string, password: string, rePassword: string) {
    return this.http
      .post<UserForAuth>('/api/users/register', {
        email,
        password,
        repass: rePassword,
      })
      .pipe(tap((user) => this.user$$.next(user)));
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
