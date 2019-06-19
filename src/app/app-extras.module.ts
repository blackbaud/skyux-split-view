import {
  NgModule
} from '@angular/core';

import {
  SkyRepeaterModule
} from '@skyux/lists';

import {
  SkySummaryActionBarModule
} from '@skyux/action-bars';

import {
  SkySplitViewModule
} from './public';

@NgModule({
  exports: [
    SkySplitViewModule,
    SkyRepeaterModule,
    SkySummaryActionBarModule
  ]
})
export class AppExtrasModule { }
