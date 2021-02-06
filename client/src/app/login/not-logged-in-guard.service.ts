import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class NotLoggedInGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(): true | UrlTree {
    return this.authService.isLoggedIn
      ? this.router.parseUrl('') // redirect to home if already logged in
      : true; // allow to visit sign in if not already logged in
  }
}
