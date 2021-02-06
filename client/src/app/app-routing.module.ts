import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LandmarksListComponent } from './landmarks/landmarks-list/landmarks-list.component';
import { LandmarkDetailComponent } from './landmarks/landmark-detail/landmark-detail.component';
import { LoginComponent } from './login/login.component';
import { LandmarkEditComponent } from './landmarks/landmark-edit/landmark-edit.component';
import { LandmarkDetailResolverService } from './landmarks/landmark-detail-resolver.service';
import { NotLoggedInGuard } from './login/not-logged-in-guard.service';

const routes: Routes = [
  {
    path: 'landmarks',
    component: LandmarksListComponent,
  },
  {
    path: 'landmarks/:id/edit',
    component: LandmarkEditComponent,
    resolve: {
      landmark: LandmarkDetailResolverService,
    },
    canActivate: [AuthGuard],
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
    component: LoginComponent,
    canActivate: [NotLoggedInGuard],
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
