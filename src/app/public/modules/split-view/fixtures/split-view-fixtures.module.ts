import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  SkyAppWindowRef
} from '@skyux/core';

import {
  SkyConfirmModule
} from '@skyux/modals';

import {
  SplitViewBeforeCloseFixtureComponent
} from './split-view-before-close.fixture';

import {
  SplitViewFixtureComponent
} from './split-view.fixture';

import {
  SkySplitViewModule
} from '../split-view.module';

@NgModule({
  declarations: [
    SplitViewFixtureComponent,
    SplitViewBeforeCloseFixtureComponent
  ],
  providers: [
    SkyAppWindowRef
  ],
  imports: [
    CommonModule,
    SkySplitViewModule
  ],
  exports: [
    SkyConfirmModule
  ]
})
export class SplitViewFixturesModule { }
