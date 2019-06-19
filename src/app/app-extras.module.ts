import {
  NgModule
} from '@angular/core';

import {
  SkyRepeaterModule
} from '@skyux/lists';

import {
  SkySplitViewModule
} from './public';

@NgModule({
  exports: [
    SkySplitViewModule,
    SkyRepeaterModule
  ]
})
export class AppExtrasModule { }
