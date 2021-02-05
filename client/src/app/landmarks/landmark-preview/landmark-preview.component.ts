import { Component, Input } from '@angular/core';
import { LandmarkInterface } from '../../common/models/Landmark';

@Component({
  selector: 'app-landmark-preview',
  templateUrl: './landmark-preview.component.html',
  styleUrls: ['./landmark-preview.component.css'],
})
export class LandmarkPreviewComponent {
  @Input() landmark!: LandmarkInterface;
  constructor() {}
}
