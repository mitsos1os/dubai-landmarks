import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandmarksListComponent } from './landmarks/landmarks-list/landmarks-list.component';
import { LandmarkDetailComponent } from './landmarks/landmark-detail/landmark-detail.component';
import { LoginComponent } from './login/login.component';
import { LandmarkEditComponent } from './landmarks/landmark-edit/landmark-edit.component';
import { LandmarkDetailResolverService } from './landmarks/landmark-detail-resolver.service';

const routes: Routes = [
  {
    path: 'landmarks',
    component: LandmarksListComponent,
  },
  {
    path: 'landmarks/:id/edit',
    component: LandmarkEditComponent, // TODO add activation guard
    resolve: {
      landmark: LandmarkDetailResolverService,
    },
  },
  {
    path: 'landmarks/:id',
    component: LandmarkDetailComponent,
    resolve: {
      landmark: LandmarkDetailResolverService,
    },
  },
  {
    path: 'login',
    component: LoginComponent, // TODO add activation guard for already logged in
  },
  {
    path: '',
    redirectTo: '/landmarks',
    pathMatch: 'full',
  },
  // TODO: add catch all and 404 routes
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
