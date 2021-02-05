import { Component, OnInit } from '@angular/core';
import { LandmarkInterface } from '../../common/models/Landmark';
import { ActivatedRoute } from '@angular/router';
import { LandmarkService } from '../../common/services/landmark.service';

@Component({
  selector: 'app-landmark-detail',
  templateUrl: './landmark-detail.component.html',
  styleUrls: ['./landmark-detail.component.css'],
})
export class LandmarkDetailComponent implements OnInit {
  landmark!: LandmarkInterface;
  constructor(
    private route: ActivatedRoute,
    private landmarkService: LandmarkService
  ) {}

  getLandmark(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.landmarkService.getLandmark(id).subscribe((landmarkRetrieved) => {
      this.landmark = landmarkRetrieved.attributes;
    });
  }

  ngOnInit(): void {
    this.getLandmark();
  }
}
