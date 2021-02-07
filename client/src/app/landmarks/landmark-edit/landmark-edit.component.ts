import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Landmark, LandmarkInterface } from '../../common/models/Landmark';

@Component({
  selector: 'app-landmark-edit',
  templateUrl: './landmark-edit.component.html',
  styleUrls: ['./landmark-edit.component.css'],
})
export class LandmarkEditComponent implements OnInit {
  landmark!: Landmark;
  landmarkData!: LandmarkInterface;
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe((routeData) => {
      this.landmark = (routeData as { landmark: Landmark }).landmark;
      this.landmarkData = this.landmark.attributes;
    });
  }
}
