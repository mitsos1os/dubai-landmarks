import { Injectable } from '@angular/core';
import { CanActivate, UrlTree, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(): true | UrlTree {
    return this.checkLogin();
  }

  checkLogin(): true | UrlTree {
    if (this.authService.isLoggedIn) {
      return true;
    }
    // Redirect to the login page if not already logged in
    return this.router.parseUrl('/login');
  }
}
