import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { IconsModule } from './icons/icons.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppCommonModule } from './common/common.module';
import { LayoutModule } from './layout/layout.module';
import { LandmarksModule } from './landmarks/landmarks.module';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './error/not-found/not-found.component';

@NgModule({
  declarations: [AppComponent, LoginComponent, NotFoundComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppCommonModule,
    LayoutModule,
    LandmarksModule,
    FormsModule,
    IconsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
