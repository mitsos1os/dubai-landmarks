import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandmarksComponent } from './landmarks.component';
import { LandmarksPageHeaderComponent } from './landmarks-page-header/landmarks-page-header.component';
import { LandmarkPreviewComponent } from './landmark-preview/landmark-preview.component';

@NgModule({
  declarations: [LandmarksComponent, LandmarksPageHeaderComponent, LandmarkPreviewComponent],
  imports: [CommonModule],
})
export class LandmarksModule {}
