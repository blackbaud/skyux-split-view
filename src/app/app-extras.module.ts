import {
  NgModule
} from '@angular/core';

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
  SkySplitViewModule
} from './public/public_api';

import {
  SkyDocsToolsModule,
  SkyDocsToolsOptions
} from '@skyux/docs-tools';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyConfirmModule,
    SkySplitViewModule,
    SkyRepeaterModule,
    SkyDocsToolsModule
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
