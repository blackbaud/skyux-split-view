import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  SkyAppWindowRef
} from '@skyux/core';

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
    FormsModule,
    SkySplitViewModule
  ]
})
export class SplitViewFixturesModule { }
