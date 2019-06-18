import {
  Component
} from '@angular/core';

import {
  SkySplitViewBeforeWorkspaceCloseHandler
} from '../types';

@Component({
  selector: 'split-view-before-close-fixture',
  templateUrl: './split-view-before-close.fixture.html'
})
export class SplitViewBeforeCloseFixtureComponent {

  public items = [
    { id: '1', name: 'apple' },
    { id: '2', name: 'banana' },
    { id: '3', name: 'orange' },
    { id: '4', name: 'pear' },
    { id: '5', name: 'strawberry' }
  ];

  public onBeforeWorkspaceClose(event: SkySplitViewBeforeWorkspaceCloseHandler): void {}

}
