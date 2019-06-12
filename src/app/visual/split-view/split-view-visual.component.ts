import {
  Component
} from '@angular/core';

import {
  SkyConfirmCloseEventArgs,
  SkyConfirmService,
  SkyConfirmType
} from '@skyux/modals';

import {
  Subject
} from 'rxjs/Subject';

import {
  SkySplitViewMessage,
  SkySplitViewMessageType
} from '../../public';

import {
  SkySplitViewBeforeWorkspaceCloseHandler
} from '../../public/modules';

@Component({
  selector: 'split-view-visual',
  templateUrl: './split-view-visual.component.html',
  styleUrls: ['./split-view-visual.component.scss']
})
export class SplitViewVisualComponent {
  public activeId: string;

  public splitViewStream = new Subject<SkySplitViewMessage>();

  public hasUnsavedWork = true;

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

  public onBeforeWorkspaceClose(closeHandler: SkySplitViewBeforeWorkspaceCloseHandler): void {
    if (this.hasUnsavedWork) {
      this.confirmService.open({
        message: 'You have unsaved work. Are you sure you want to close this dialog?',
        type: SkyConfirmType.YesCancel
      }).closed.subscribe((closeArgs: SkyConfirmCloseEventArgs) => {
        if (closeArgs.action.toLowerCase() === 'yes') {
          closeHandler.closeWorkspace();
        }
      });
    } else {
      closeHandler.closeWorkspace();
    }
  }

}
