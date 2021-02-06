import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  public isCollapsed = true;
  faUser = faUser;
  constructor(private authService: AuthService) {}

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
    this.authService.logout();
  }
}
