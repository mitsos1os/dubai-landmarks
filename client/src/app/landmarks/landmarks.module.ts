import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';
import { LandmarksListComponent } from './landmarks-list/landmarks-list.component';
import { LandmarksPageHeaderComponent } from './landmarks-page-header/landmarks-page-header.component';
import { LandmarkPreviewComponent } from './landmark-preview/landmark-preview.component';
import { LandmarkDetailComponent } from './landmark-detail/landmark-detail.component';
import { FullphotoComponent } from './fullphoto/fullphoto.component';
import { LandmarkEditComponent } from './landmark-edit/landmark-edit.component';
import { FormsModule } from '@angular/forms';
import { IconsModule } from '../icons/icons.module';

@NgModule({
  declarations: [
    LandmarksListComponent,
    LandmarksPageHeaderComponent,
    LandmarkPreviewComponent,
    LandmarkDetailComponent,
    FullphotoComponent,
    LandmarkEditComponent,
  ],
  imports: [CommonModule, AppRoutingModule, FormsModule, IconsModule],
  entryComponents: [FullphotoComponent],
})
export class LandmarksModule {}
