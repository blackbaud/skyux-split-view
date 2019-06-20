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

@NgModule({
  exports: [
    SkyConfirmModule,
    SkySplitViewModule,
    SkyRepeaterModule
  ]
})
export class AppExtrasModule { }
