import {
  NgModule
} from '@angular/core';

import {
  SkyDocsToolsModule,
  SkyDocsToolsOptions
} from '@skyux/docs-tools';

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
  SkyDocsToolsModule,
  SkyDocsToolsOptions
} from '@skyux/docs-tools';

import {
  SkySplitViewModule
} from './public/public_api';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyConfirmModule,
    SkyDocsToolsModule,
    SkySplitViewModule,
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
