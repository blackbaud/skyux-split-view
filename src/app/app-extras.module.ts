import {
  NgModule
} from '@angular/core';

import {
  SkyConfirmModule
} from '@skyux/modals';

import {
  SkyRepeaterModule
} from '@skyux/lists';

import {
  SkySplitViewModule
} from './public';

import {
  AppSkyModule
} from './app-sky.module';

@NgModule({
  exports: [
    AppSkyModule,
    SkyConfirmModule,
    SkySplitViewModule,
    SkyRepeaterModule
  ]
})
export class AppExtrasModule { }
