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
  SkySplitViewComponent
} from './split-view.component';

import {
  SkySplitViewWorkspaceComponent
} from './split-view-workspace.component';

import {
  SkySplitViewListComponent
} from './split-view-list.component';

import {
  SkySplitViewResourcesModule
} from '../shared';

@NgModule({
  declarations: [
    SkySplitViewComponent,
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
    SkySplitViewListComponent,
    SkySplitViewWorkspaceComponent
  ]
})
export class SkySplitViewModule { }
