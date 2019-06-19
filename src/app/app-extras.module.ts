import {
  NgModule
} from '@angular/core';

import {
  SkySplitViewModule
} from './public';

@NgModule({
  imports: [
    SkySplitViewModule
  ],
  exports: [
    SkySplitViewModule
  ]
})
export class AppExtrasModule { }
