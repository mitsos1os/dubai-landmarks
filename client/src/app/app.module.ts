import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppCommonModule } from './common/common.module';
import { LayoutModule } from './layout/layout.module';
import { LandmarksModule } from './landmarks/landmarks.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppCommonModule,
    LayoutModule,
    LandmarksModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
