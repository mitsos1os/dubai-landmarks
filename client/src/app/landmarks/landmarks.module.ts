import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandmarksComponent } from './landmarks.component';
import { LandmarksPageHeaderComponent } from './landmarks-page-header/landmarks-page-header.component';

@NgModule({
  declarations: [LandmarksComponent, LandmarksPageHeaderComponent],
  imports: [CommonModule],
})
export class LandmarksModule {}
