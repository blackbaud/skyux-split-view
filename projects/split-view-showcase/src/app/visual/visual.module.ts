import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SkySummaryActionBarModule } from '@skyux/action-bars';
import { SkyE2eThemeSelectorModule } from '@skyux/e2e-client';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyDefinitionListModule } from '@skyux/layout';
import { SkyRepeaterModule } from '@skyux/lists';
import { SkySplitViewModule } from 'split-view';
import { SplitViewWithRepeaterVisualComponent } from './split-view/basic/split-view-visual.component';
import { SplitViewVisualComponent } from './split-view/page-bound/split-view-visual.component';
import { VisualComponent } from './visual.component';



@NgModule({
  declarations: [
    SplitViewVisualComponent,
    SplitViewWithRepeaterVisualComponent,
    VisualComponent
  ],
  exports: [
    SplitViewVisualComponent,
    SplitViewWithRepeaterVisualComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SkyDefinitionListModule,
    SkyE2eThemeSelectorModule,
    SkyInputBoxModule,
    SkyRepeaterModule,
    SkySplitViewModule,
    SkySummaryActionBarModule
  ]
})
export class VisualModule { }
