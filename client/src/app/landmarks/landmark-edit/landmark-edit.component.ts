import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Landmark, LandmarkInterface } from '../../common/models/Landmark';
import { environment } from '../../../environments/environment';
import { Parse } from '../../common/parse';

/**
 * The maximum allowed size of photos to upload as a landmark photo
 */
const { maxPhotoSize = 5000000 } = environment;

type LandmarkPlainData = Omit<
  LandmarkInterface,
  'location' | 'photo' | 'photo_thumb'
>;

@Component({
  selector: 'app-landmark-edit',
  templateUrl: './landmark-edit.component.html',
  styleUrls: ['./landmark-edit.component.css'],
})
export class LandmarkEditComponent implements OnInit {
  landmark!: Landmark;
  landmarkFormData!: LandmarkPlainData;
  location = { lat: 0, lng: 0 };
  imageURL?: string;
  imageFileSizeError = false;
  imageFileToUpload: File | null = null;
  readonly maxPhotoSize = maxPhotoSize;
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe((routeData) => {
      this.landmark = (routeData as { landmark: Landmark }).landmark;
      this.extractData(this.landmark);
    });
  }

  /**
   * Extract data from landmark instance and save in appropriate variables.
   * Only primitive data will be directly copied, due to more complex form
   * handling needed for advanced types such as number arrays and Parse.File
   * entries
   * @param {Landmark} landmark
   */
  extractData(landmark: Landmark): void {
    const keysToSkip = ['location', 'photo', 'photo_thumb'];
    const { attributes: readOnlyAttributes } = landmark;
    this.landmarkFormData = Object.entries(readOnlyAttributes).reduce(
      (final, [key, value]) => {
        if (!keysToSkip.includes(key)) {
          // @ts-ignore
          final[key] = value;
        }
        return final;
      },
      {} as LandmarkPlainData
    );
    const [lat, lng] = readOnlyAttributes?.location || [];
    this.location.lat = lat;
    this.location.lng = lng;
    this.imageURL = readOnlyAttributes.photo?.url();
  }

  clearFileAndPreview(element: HTMLInputElement) {
    this.imageURL = ''; // clear imageUrl
    this.imageFileToUpload = null;
    element.value = ''; // clear files selection
  }

  fillPreview(file: File) {
    this.imageFileToUpload = file;
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
    } else {
      this.fillPreview(file);
    }
  }

  updateLandmarkObject() {
    const { landmark } = this;
    // first check plain properties
    Object.entries(this.landmarkFormData).forEach(([key, value]) => {
      const landmarkValue = landmark.get(key);
      if (landmarkValue === value) return; // no change
      // check for previously existing value now cleared
      if ((landmarkValue && value == null) || value === '') {
        // empty string for text inputs and null for number and file
        landmark.unset(key);
      } else {
        // value updated
        landmark.set(key, value);
      }
    });
    // add complex properties
    // add location
    const { lat, lng } = this.location;
    if (lat == null && lng == null) {
      // clear location
      landmark.unset('location');
    } else {
      const [currentLat, currentLng] = landmark.get('location');
      if (currentLat !== lat || currentLng !== lng) {
        // updated location
        landmark.set('location', [lat, lng]);
      }
    }
    // check photo
    const currentPhotoUrl = landmark.get('photo').url();
    if (!this.imageURL && currentPhotoUrl) {
      // photo deleted
      landmark.unset('photo');
    } else if (this.imageURL !== currentPhotoUrl) {
      // update photo
      const { imageFileToUpload } = this;
      if (!imageFileToUpload)
        throw new Error('Reached file updated without file reference');
      landmark.set(
        'photo',
        new Parse.File(
          imageFileToUpload.name,
          imageFileToUpload,
          imageFileToUpload.type
        )
      );
    }
  }

  onSubmit(): void {
    this.updateLandmarkObject();
    if (!this.landmark.dirty()) return; // nothing to do for unchanged landmark
  }
}
