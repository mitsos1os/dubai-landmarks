import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserCredentials } from '../auth/user-credentials';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  credentials: Partial<UserCredentials> = {};
  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login(<UserCredentials>this.credentials).subscribe(() => {
      console.log('Redirecting to home after successful log in...');
      this.router.navigate(['/landmarks']);
    });
  }
}
