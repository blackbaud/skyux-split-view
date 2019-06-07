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
  SplitViewFixtureComponent
} from './split-view.fixture';

import {
  SkySplitViewModule
} from '../split-view.module';

@NgModule({
  declarations: [
    SplitViewFixtureComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SkySplitViewModule
  ]
})
export class SplitViewFixturesModule { }
