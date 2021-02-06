import { Component, OnInit } from '@angular/core';
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
  landmark!: LandmarkInterface;
  constructor(private route: ActivatedRoute, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.route.data.subscribe((routeData) => {
      this.landmark = (routeData as { landmark: Landmark }).landmark.attributes;
    });
  }

  openPhoto(): void {
    const modalRef = this.modalService.open(FullphotoComponent);
    modalRef.componentInstance.title = this.landmark.title;
    if (!this.landmark.photo) {
      throw new Error(
        `Reached non existing photo url in ${this.landmark.title}`
      );
    }
    modalRef.componentInstance.photo_url = this.landmark.photo.url();
  }
}
