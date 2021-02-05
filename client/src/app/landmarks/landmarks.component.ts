import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { LandmarkService } from '../common/services/landmark.service';
import { Landmark } from '../common/models/Landmark';

@Component({
  selector: 'app-landmarks',
  templateUrl: './landmarks.component.html',
  styleUrls: ['./landmarks.component.css'],
})
export class LandmarksComponent {
  landmarks$: Observable<Landmark[]>;
  constructor(private landmarkService: LandmarkService) {
    this.landmarks$ = this.landmarkService.getLandMarksList();
  }
}
