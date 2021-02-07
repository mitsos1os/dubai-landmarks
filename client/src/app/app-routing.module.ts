import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { NotFoundComponent } from './error/not-found/not-found.component';
import { LandmarksListComponent } from './landmarks/landmarks-list/landmarks-list.component';
import { LandmarkDetailComponent } from './landmarks/landmark-detail/landmark-detail.component';
import { LoginComponent } from './login/login.component';
import { LandmarkEditComponent } from './landmarks/landmark-edit/landmark-edit.component';
import { LandmarkDetailResolverService } from './landmarks/landmark-detail-resolver.service';
import { NotLoggedInGuard } from './login/not-logged-in-guard.service';
import { AboutComponent } from './about/about.component';

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
    canActivate: [AuthGuard], // make sure route cannot be accessed from non-admin user
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
    path: 'about',
    component: AboutComponent,
  },
  {
    path: '',
    redirectTo: '/landmarks',
    pathMatch: 'full',
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
