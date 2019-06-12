import {
  Component
} from '@angular/core';

import {
  Subject
} from 'rxjs/Subject';

import {
  SkySplitViewMessage, SkySplitViewMessageType
} from '../../public';

@Component({
  selector: 'split-view-visual',
  templateUrl: './split-view-visual.component.html',
  styleUrls: ['./split-view-visual.component.scss']
})
export class SplitViewVisualComponent {
  public activeId: string;

  public splitViewStream = new Subject<SkySplitViewMessage>();

  public items = [
    { id: '1', name: 'apple' },
    { id: '2', name: 'banana' },
    { id: '3', name: 'orange' },
    { id: '4', name: 'pear' },
    { id: '5', name: 'strawberry' }
  ];

  public onItemClick(record: any) {
    this.openWorkspace(record);
  }

  public openWorkspace(record: any): void {
    // Set active id so the proper repeater shows an active state.
    this.activeId = record.id;

    // Load new workspace.

    // Set focus in workspace.
    const message: SkySplitViewMessage = {
      type: SkySplitViewMessageType.FocusWorkspace
    };
    this.splitViewStream.next(message);
  }

  public onIteratorNextButtonClick(): void {
    console.log('Next button clicked.');
  }

  public onIteratorPreviousButtonClick(): void {
    console.log('Previous button clicked.');
  }

}
