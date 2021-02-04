import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandmarksComponent } from './landmarks/landmarks.component';

const routes: Routes = [
  {
    path: '',
    component: LandmarksComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
