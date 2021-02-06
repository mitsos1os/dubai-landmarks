import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';
import { LandmarksListComponent } from './landmarks-list/landmarks-list.component';
import { LandmarksPageHeaderComponent } from './landmarks-page-header/landmarks-page-header.component';
import { LandmarkPreviewComponent } from './landmark-preview/landmark-preview.component';
import { LandmarkDetailComponent } from './landmark-detail/landmark-detail.component';
import { FullphotoComponent } from './fullphoto/fullphoto.component';

@NgModule({
  declarations: [
    LandmarksListComponent,
    LandmarksPageHeaderComponent,
    LandmarkPreviewComponent,
    LandmarkDetailComponent,
    FullphotoComponent,
  ],
  imports: [CommonModule, AppRoutingModule],
  entryComponents: [FullphotoComponent],
})
export class LandmarksModule {}
