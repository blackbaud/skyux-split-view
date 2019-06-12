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
  SkyConfirmComponent,
  SkyConfirmService,
  SkyModalModule
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

@NgModule({
  declarations: [
    SkySplitViewComponent,
    SkySplitViewIteratorComponent,
    SkySplitViewListComponent,
    SkySplitViewWorkspaceComponent,
    SkyConfirmComponent
  ],
  providers: [
    SkyConfirmService,
    SkyCoreAdapterService,
    SkyMediaQueryService
  ],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    SkySplitViewResourcesModule,
    SkyIconModule,
    SkyModalModule
  ],
  exports: [
    SkySplitViewComponent,
    SkySplitViewIteratorComponent,
    SkySplitViewListComponent,
    SkySplitViewWorkspaceComponent
  ],
  entryComponents: [
    SkyConfirmComponent
  ]
})
export class SkySplitViewModule { }
