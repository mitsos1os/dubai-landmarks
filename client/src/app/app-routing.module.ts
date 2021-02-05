import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandmarksListComponent } from './landmarks/landmarks-list/landmarks-list.component';

const routes: Routes = [
  {
    path: '',
    component: LandmarksListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
