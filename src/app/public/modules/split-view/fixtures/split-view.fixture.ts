import {
  Component,
  ViewChild
} from '@angular/core';

import {
  SkyConfirmService
} from '@skyux/modals';

import {
  Subject
} from 'rxjs/Subject';

import {
  SkySplitViewComponent
} from '../split-view.component';

import {
  SkySplitViewMessage
} from '../types/split-view-message';

@Component({
  selector: 'split-view-fixture',
  templateUrl: './split-view.fixture.html'
})
export class SplitViewFixtureComponent {

  public listWidth: number;

  public ariaLabelForList: string;

  public ariaLabelForWorkspace: string;

  public ariaRoleForList: string;

  public ariaRoleForWorkspace: string;

  public showIframe = false;

  public splitViewMessageStream = new Subject<SkySplitViewMessage>();

  @ViewChild(SkySplitViewComponent)
  public splitViewComponent: SkySplitViewComponent;

  public hasUnsavedWork = false;

  public items = [
    { id: '1', name: 'apple' },
    { id: '2', name: 'banana' },
    { id: '3', name: 'orange' },
    { id: '4', name: 'pear' },
    { id: '5', name: 'strawberry' }
  ];

  constructor(
    public confirmService: SkyConfirmService
  ) {}

  public onIteratorNextButtonClick(): void {
    console.log('next button clicked');
  }

  public onIteratorPreviousButtonClick(): void {
    console.log('previous button clicked');
  }

}
