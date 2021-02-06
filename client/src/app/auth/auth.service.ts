import { Injectable } from '@angular/core';
import { Parse } from '../common/parse';
import { Observable, from, throwError } from 'rxjs';
import { UserCredentials } from './user-credentials';

/**
 * Authentication service used for user interactions such as login, logout,
 * retrieving current user, etc...
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  /**
   * Getter to know if a user is actually logged in the service
   */
  get isLoggedIn(): boolean {
    return !!this.currentUser();
  }

  login({ username, password }: UserCredentials): Observable<Parse.User> {
    return from(Parse.User.logIn(username, password));
  }

  logout(): Observable<Parse.User> {
    if (!this.isLoggedIn)
      return throwError(new Error('Cannot logout non-logged in user'));
    return from(Parse.User.logOut());
  }

  currentUser(): Parse.User | undefined {
    return Parse.User.current();
  }
}
