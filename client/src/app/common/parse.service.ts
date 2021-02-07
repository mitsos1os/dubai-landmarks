import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Parse } from './parse';
import { Observable, from, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

/**
 * Helper service to handle common scenarios for all Parse functionality
 */
@Injectable({
  providedIn: 'root',
})
export class ParseService {
  constructor(private router: Router, private authService: AuthService) {}

  /**
   * Helper method that will accept and kind of web operation from Parse
   * and will handle failure due to authentication problem
   * @param {Parse.Promise} requestPromise
   */
  sendParseRequest<T>(requestPromise: Parse.Promise<T>): Observable<T> {
    return from(requestPromise).pipe(
      catchError((err: Parse.Error) => {
        // check if it is an invalid session error that would require logging out
        const { code } = err;
        if (code >= 200 && code <= 209) {
          //session error
          const {
            router: { url },
          } = this;
          this.authService
            .logout()
            .pipe(
              finalize(() =>
                this.router.navigate([url], { queryParams: { refresh: '' } })
              ) // redirect after logout
            )
            .subscribe();
        }
        return throwError(err); // bubble up error
      })
    );
  }
}
