import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Landmark, LandmarkInterface } from '../../common/models/Landmark';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FullphotoComponent } from '../fullphoto/fullphoto.component';

@Component({
  selector: 'app-landmark-detail',
  templateUrl: './landmark-detail.component.html',
  styleUrls: ['./landmark-detail.component.css'],
})
export class LandmarkDetailComponent implements OnInit {
  landmark!: Landmark;
  landmarkData!: LandmarkInterface;
  landmarkLat?: number;
  landmarkLng?: number;
  constructor(
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((routeData) => {
      this.landmark = (routeData as { landmark: Landmark }).landmark;
      this.landmarkData = this.landmark.attributes;
      this.landmarkLat = this.landmarkData.location?.[0];
      this.landmarkLng = this.landmarkData.location?.[1];
    });
  }

  loggedIn() {
    return this.authService.isLoggedIn;
  }

  openPhoto(): void {
    const modalRef = this.modalService.open(FullphotoComponent);
    modalRef.componentInstance.title = this.landmarkData.title;
    if (!this.landmarkData.photo) {
      throw new Error(
        `Reached non existing photo url in ${this.landmarkData.title}`
      );
    }
    modalRef.componentInstance.photo_url = this.landmarkData.photo.url();
  }
}
