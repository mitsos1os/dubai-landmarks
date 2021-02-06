import { Component } from '@angular/core';
import { UserCredentials } from '../auth/user-credentials';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent{
  user: Partial<UserCredentials> = {};
  constructor() {}

}
