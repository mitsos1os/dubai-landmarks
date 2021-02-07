import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  public isCollapsed = true;
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  userLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  toggleMenu() {
    this.isCollapsed = !this.isCollapsed;
  }

  closeMenu() {
    this.isCollapsed = true;
  }

  logout(): void {
    this.authService
      .logout()
      .pipe(finalize(() => this.router.navigate([''])))
      .subscribe();
  }

  goToLogin(): void {
    this.closeMenu();
    const {
      router: { url: currentUrl },
    } = this;
    const isAlreadyLogin = currentUrl.includes('/login');
    if (isAlreadyLogin) return; // nothing to do
    this.router.navigate(['/login'], {
      fragment: currentUrl,
    });
  }
}
