import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { LandmarkService } from '../landmark.service';
import { Landmark } from '../../common/models/Landmark';

@Component({
  selector: 'app-landmarks-list',
  templateUrl: './landmarks-list.component.html',
  styleUrls: ['./landmarks-list.component.css'],
})
export class LandmarksListComponent {
  landmarks$: Observable<Landmark[]>;
  isLoggedIn: boolean;
  constructor(
    private landmarkService: LandmarkService,
    private authService: AuthService
  ) {
    this.landmarks$ = this.landmarkService.getLandMarksList();
    this.isLoggedIn = this.authService.isLoggedIn;
  }
}
