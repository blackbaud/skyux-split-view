import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  BrowserAnimationsModule
} from '@angular/platform-browser/animations';

import {
  SkyMediaQueryService, SkyAdapterService
} from '@skyux/core';

import {
  SkyIconModule
} from '@skyux/indicators';

import {
  SkySplitViewResourcesModule
} from '../shared';

import {
  SkySplitViewComponent
} from './split-view.component';

import {
  SkySplitViewIteratorComponent
} from './split-view-iterator.component';

import {
  SkySplitViewListComponent
} from './split-view-list.component';

import {
  SkySplitViewWorkspaceComponent
} from './split-view-workspace.component';

@NgModule({
  declarations: [
    SkySplitViewComponent,
    SkySplitViewIteratorComponent,
    SkySplitViewListComponent,
    SkySplitViewWorkspaceComponent
  ],
  providers: [
    SkyAdapterService,
    SkyMediaQueryService
  ],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    SkySplitViewResourcesModule,
    SkyIconModule
  ],
  exports: [
    SkySplitViewComponent,
    SkySplitViewIteratorComponent,
    SkySplitViewListComponent,
    SkySplitViewWorkspaceComponent
  ]
})
export class SkySplitViewModule { }
