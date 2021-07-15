import {
  NgModule
} from '@angular/core';

import {
  SkySummaryActionBarModule
} from '@skyux/action-bars';

import {
  SkyIdModule
} from '@skyux/core';

import {
  SkyDocsToolsModule,
  SkyDocsToolsOptions
} from '@skyux/docs-tools';

import {
  SkyCheckboxModule,
  SkyInputBoxModule
} from '@skyux/forms';

import {
  SkyDefinitionListModule
} from '@skyux/layout';

import {
  SkyRepeaterModule
} from '@skyux/lists';

import {
  SkyConfirmModule
} from '@skyux/modals';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkySplitViewForRootCompatModule
} from './public/modules/shared/split-view-for-root-compat.module';

import {
  SkySplitViewModule
} from './public/public_api';

@NgModule({
  imports: [
    SkySplitViewForRootCompatModule
  ],
  exports: [
    SkyAppLinkModule,
    SkyCheckboxModule,
    SkyConfirmModule,
    SkyDefinitionListModule,
    SkyDocsToolsModule,
    SkyIdModule,
    SkyInputBoxModule,
    SkySplitViewModule,
    SkySummaryActionBarModule,
    SkyRepeaterModule
  ],
  providers: [
    {
      provide: SkyDocsToolsOptions,
      useValue: {
        gitRepoUrl: 'https://github.com/blackbaud/skyux-split-view',
        packageName: '@skyux/split-view'
      }
    }
  ]
})
export class AppExtrasModule { }
