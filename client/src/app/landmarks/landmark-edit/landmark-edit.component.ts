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
  location = { lat: 0, lng: 0 };
  imageURL?: string;
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe((routeData) => {
      this.landmark = (routeData as { landmark: Landmark }).landmark;
      this.extractData(this.landmark);
    });
  }

  extractData(landmark: Landmark): void {
    this.landmarkData = this.landmark.attributes;
    const [lat, lng] = this.landmarkData?.location || [];
    this.location.lat = lat;
    this.location.lng = lng;
    this.imageURL = this.landmarkData.photo?.url();
  }
}
