import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  BrowserAnimationsModule
} from '@angular/platform-browser/animations';

import {
  SkyCoreAdapterService,
  SkyMediaQueryService
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
  SkySplitViewListComponent
} from './split-view-list.component';

import {
  SkySplitViewMediaQueryService
} from './split-view-media-query.service';

import {
  SkySplitViewWorkspaceComponent
} from './split-view-workspace.component';

@NgModule({
  declarations: [
    SkySplitViewComponent,
    SkySplitViewListComponent,
    SkySplitViewWorkspaceComponent
  ],
  providers: [
    SkyCoreAdapterService,
    SkyMediaQueryService,
    SkySplitViewMediaQueryService
  ],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
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
