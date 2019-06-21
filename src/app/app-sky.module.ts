import {
  NgModule
} from '@angular/core';

import {
  SkyMediaQueryModule
} from '@skyux/core';

import {
  SkyI18nModule
} from '@skyux/i18n';

import {
  SkyIconModule
} from '@skyux/indicators';

import {
  SkyRepeaterModule
} from '@skyux/lists';

import {
  SkyConfirmModule
} from '@skyux/modals';

import {
  SkyAppLinkModule
} from '@skyux/router';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyConfirmModule,
    SkyI18nModule,
    SkyIconModule,
    SkyMediaQueryModule,
    SkyRepeaterModule
  ]
})
export class AppSkyModule { }
