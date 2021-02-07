import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { max } from 'rxjs/operators';
import { Landmark, LandmarkInterface } from '../../common/models/Landmark';
import { environment } from '../../../environments/environment';

/**
 * The maximum allowed size of photos to upload as a landmark photo
 */
const { maxPhotoSize = 5000000 } = environment;

@Component({
  selector: 'app-landmark-edit',
  templateUrl: './landmark-edit.component.html',
  styleUrls: ['./landmark-edit.component.css'],
})
export class LandmarkEditComponent implements OnInit {
  landmark!: Landmark;
  landmarkFormData!: LandmarkInterface;
  location = { lat: 0, lng: 0 };
  imageURL?: string;
  imageFileSizeError = false;
  readonly maxPhotoSize = maxPhotoSize;
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe((routeData) => {
      this.landmark = (routeData as { landmark: Landmark }).landmark;
      this.extractData(this.landmark);
    });
  }

  extractData(landmark: Landmark): void {
    this.landmarkFormData = { ...this.landmark.attributes };
    const [lat, lng] = this.landmarkFormData?.location || [];
    this.location.lat = lat;
    this.location.lng = lng;
    this.imageURL = this.landmarkFormData.photo?.url();
  }

  clearFileAndPreview(element: HTMLInputElement) {
    this.imageURL = ''; // clear imageUrl
    element.value = ''; // clear files selection
  }

  fillPreview(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  fileSizeAcceptable(file: File): boolean {
    return !(this.imageFileSizeError = file.size > maxPhotoSize);
  }

  getPhotoFileFromElement(element: HTMLInputElement): File | undefined {
    return element.files?.[0];
  }

  showPreview(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const file = this.getPhotoFileFromElement(inputElement);
    if (!file || !this.fileSizeAcceptable(file)) {
      // check if cleared entry
      this.clearFileAndPreview(inputElement);
      return; // nothing else to do
    }
    this.fillPreview(file);
  }
}
