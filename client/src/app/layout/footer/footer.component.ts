import { Component } from '@angular/core';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faGithub } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {
  faCircle = faCircle;
  faFacebookF = faFacebookF;
  faGithub = faGithub;
  constructor() {}
}
