import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserCredentials } from '../auth/user-credentials';
import { AuthService } from '../auth/auth.service';
import { Parse } from '../common/parse';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  credentials: Partial<UserCredentials> = {};
  wrongCredentials = false;
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  onSubmit() {
    this.authService.login(<UserCredentials>this.credentials).subscribe(
      () => {
        this.wrongCredentials = false;
        console.log('Redirecting to home after successful log in...');
        this.router.navigate([this.route.snapshot.fragment ?? '/landmarks']);
      },
      (err) => {
        if (err.code === Parse.ErrorCode.OBJECT_NOT_FOUND) {
          // parse uses same code 101 for invalid login credentials
          this.wrongCredentials = true;
        }
      }
    );
  }
}
