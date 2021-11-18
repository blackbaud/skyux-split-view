import { NgModule } from '@angular/core';
import { SkyAppConfig } from '@skyux/config';
import { SkyThemeService } from '@skyux/theme';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VisualModule } from './visual/visual.module';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [AppComponent],
  imports: [NoopAnimationsModule, AppRoutingModule, VisualModule],
  providers: [SkyThemeService, SkyAppConfig],
  bootstrap: [AppComponent],
})
export class AppModule {}
