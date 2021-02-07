import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';

import { IconsModule } from './icons/icons.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppCommonModule } from './common/common.module';
import { LayoutModule } from './layout/layout.module';
import { LandmarksModule } from './landmarks/landmarks.module';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './error/not-found/not-found.component';
import { AboutComponent } from './about/about.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NotFoundComponent,
    AboutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppCommonModule,
    LayoutModule,
    LandmarksModule,
    FormsModule,
    IconsModule,
    AgmCoreModule.forRoot({
      apiKey: '', // proper API key should be used for production
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
