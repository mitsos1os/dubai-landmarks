import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { LandmarkService } from '../../common/services/landmark.service';
import { Landmark } from '../../common/models/Landmark';

@Component({
  selector: 'app-landmarks-list',
  templateUrl: './landmarks-list.component.html',
  styleUrls: ['./landmarks-list.component.css'],
})
export class LandmarksListComponent {
  landmarks$: Observable<Landmark[]>;
  constructor(private landmarkService: LandmarkService) {
    this.landmarks$ = this.landmarkService.getLandMarksList();
  }
}
