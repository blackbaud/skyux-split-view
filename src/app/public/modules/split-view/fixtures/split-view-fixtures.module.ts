import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  SkySummaryActionBarModule
} from '@skyux/action-bars';

import {
  SkyAppWindowRef
} from '@skyux/core';

import {
  SkyConfirmModule
} from '@skyux/modals';

import {
  SkyThemeModule
} from '@skyux/theme';

import {
  SplitViewFixtureComponent
} from './split-view.fixture';

import {
  SkySplitViewModule
} from '../split-view.module';

@NgModule({
  declarations: [
    SplitViewFixtureComponent
  ],
  providers: [
    SkyAppWindowRef
  ],
  imports: [
    CommonModule,
    SkySplitViewModule,
    SkySummaryActionBarModule,
    SkyThemeModule
  ],
  exports: [
    SkyConfirmModule
  ]
})
export class SplitViewFixturesModule { }
