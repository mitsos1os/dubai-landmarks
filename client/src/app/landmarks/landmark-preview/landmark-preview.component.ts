import { Component, Input, OnInit } from '@angular/core';
import { Landmark, LandmarkInterface } from '../../common/models/Landmark';

@Component({
  selector: 'app-landmark-preview',
  templateUrl: './landmark-preview.component.html',
  styleUrls: ['./landmark-preview.component.css'],
})
export class LandmarkPreviewComponent implements OnInit {
  @Input() landmark!: Landmark;
  landmarkData!: LandmarkInterface;
  constructor() {}

  ngOnInit() {
    this.landmarkData = this.landmark.attributes;
  }
}
