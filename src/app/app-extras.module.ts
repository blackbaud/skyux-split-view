import {
  NgModule
} from '@angular/core';

import {
  SkySplitViewModule
} from './public/modules/split-view';

@NgModule({
  imports: [
    SkySplitViewModule
  ],
  exports: [
    SkySplitViewModule
  ]
})
export class AppExtrasModule { }
