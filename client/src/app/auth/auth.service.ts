import { Injectable } from '@angular/core';
import { Parse } from '../common/parse';
import { Observable, from, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
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
    return from(Parse.User.logIn(username, password)).pipe(
      tap(() => console.log(`Successfully logged in user ${username}`))
    );
  }

  logout(): Observable<Parse.User> {
    const currentUser = this.currentUser();
    if (!currentUser)
      return throwError(new Error('Cannot logout non-logged in user'));
    return from(Parse.User.logOut()).pipe(
      tap(
        () =>
          console.log(
            `Successfully logged out user ${currentUser.getUsername()}`
          ),
        (err) => console.error('Logout failed with error', err)
      )
    );
  }

  currentUser(): Parse.User | undefined {
    return Parse.User.current();
  }
}
