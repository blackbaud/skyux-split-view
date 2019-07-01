import {
  NgModule
} from '@angular/core';

import {
  SkySplitViewModule
} from './public';

import {
  AppSkyModule
} from './app-sky.module';

@NgModule({
  exports: [
    AppSkyModule,
    SkySplitViewModule
  ]
})
export class AppExtrasModule { }
