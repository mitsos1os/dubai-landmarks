import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandmarksListComponent } from './landmarks/landmarks-list/landmarks-list.component';
import { LandmarkDetailComponent } from './landmarks/landmark-detail/landmark-detail.component';

const routes: Routes = [
  {
    path: 'landmarks',
    component: LandmarksListComponent,
  },
  {
    path: 'landmarks/:id',
    component: LandmarkDetailComponent,
  },
  {
    path: '',
    redirectTo: '/landmarks',
    pathMatch: 'full',
  },
  // TODO: add catch all and 404 routes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
