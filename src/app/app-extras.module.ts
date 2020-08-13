import {
  NgModule
} from '@angular/core';

import {
  SkyCheckboxModule
} from '@skyux/forms';

import {
  SkyRepeaterModule
} from '@skyux/lists';

import {
  SkyConfirmModule
} from '@skyux/modals';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkySplitViewModule
} from './public/public_api';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyCheckboxModule,
    SkyConfirmModule,
    SkySplitViewModule,
    SkyRepeaterModule
  ]
})
export class AppExtrasModule { }
