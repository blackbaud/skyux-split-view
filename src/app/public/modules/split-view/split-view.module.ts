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
  SkyCoreAdapterService,
  SkyMediaQueryService
} from '@skyux/core';

import {
  SkyIconModule
} from '@skyux/indicators';

import {
  SkyConfirmModule
} from '@skyux/modals';

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

import {
  SkySplitViewMediaQueryService
} from './split-view-media-query.service';

@NgModule({
  declarations: [
    SkySplitViewComponent,
    SkySplitViewIteratorComponent,
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
    FormsModule,
    SkyConfirmModule,
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
