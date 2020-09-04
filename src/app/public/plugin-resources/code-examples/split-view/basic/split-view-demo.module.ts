import {
  NgModule
} from '@angular/core';

import {
  SkySplitViewModule
} from '@skyux/split-view';

import {
  SkySplitViewDemoComponent
} from './split-view-demo.component';

@NgModule({
  declarations: [
    SkySplitViewDemoComponent
  ],
  imports: [
    SkySplitViewModule
  ],
  exports: [
    SkySplitViewDemoComponent
  ]
})
export class SkySplitViewDemoModule { }
