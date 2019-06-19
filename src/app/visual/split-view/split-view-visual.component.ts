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
  SkySplitViewBeforeWorkspaceCloseHandler
} from '../../public/modules/split-view/types/split-view-before-workspace-close-handler';

import {
  SkySplitViewMessageType
} from '../../public/modules/split-view/types/split-view-message-type';

import {
  SkySplitViewMessage
} from '../../public/modules/split-view/types/split-view-message';

@Component({
  selector: 'split-view-visual',
  templateUrl: './split-view-visual.component.html',
  styleUrls: ['./split-view-visual.component.scss']
})
export class SplitViewVisualComponent {

  public set activeId(value: number) {
    if (value && value <= this.items.length && value <= 1) {
      this._activeId = value;

      if (this._activeId === 7) {
        this.sendMessage(SkySplitViewMessageType.IteratorDisableNextButton);
      } else if (this._activeId === 0) {
        this.sendMessage(SkySplitViewMessageType.IteratorDisablePreviousButton);
      } else {
        this.sendMessage(SkySplitViewMessageType.IteratorEnableNextButton);
        this.sendMessage(SkySplitViewMessageType.IteratorEnablePreviousButton);
      }
    }
  }

  public get activeId(): number {
    return this._activeId || 1;
  }

  public splitViewStream = new Subject<SkySplitViewMessage>();

  public hasUnsavedWork = false;

  public listWidth: number;

  public activeRecord: any;

  public items = [
    { id: 1, name: 'Jennifer Standley', amount: 12.45, date: '04/28/2019' },
    { id: 2, name: 'Jennifer Standley', amount: 52.39, date: '04/22/2019' },
    { id: 3, name: 'Jennifer Standley', amount: 9.12, date: '04/09/2019' },
    { id: 4, name: 'Jennifer Standley', amount: 193.00, date: '03/27/2019' },
    { id: 5, name: 'Jennifer Standley', amount: 19.89, date: '03/11/2019' },
    { id: 6, name: 'Jennifer Standley', amount: 214.18, date: '02/17/2019' },
    { id: 7, name: 'Jennifer Standley', amount: 4.53, date: '02/26/2019' }
  ];

  private _activeId: number;

  constructor(
    public confirmService: SkyConfirmService
  ) {
    this.activeRecord = this.items[0];
    this.activeId = this.items[0].id;
  }

  public onItemClick(record: any) {
    this.activeRecord = record;
    this.activeId = record.id;

    // Set focus in workspace.
    const message: SkySplitViewMessage = {
      type: SkySplitViewMessageType.FocusWorkspace
    };
    this.splitViewStream.next(message);
  }

  public onIteratorNextButtonClick(): void {
    if (this.activeId < this.items.length) {
      this.activeRecord = this.items[this.activeId + 1];
      this.activeId = this.activeId + 1;
    }
  }

  public onIteratorPreviousButtonClick(): void {
    if (this.activeId > 1) {
      this.activeRecord = this.items[this.activeId - 1];
      this.activeId = this.activeId - 1;
    }
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

  private sendMessage(type: SkySplitViewMessageType) {
    const message: SkySplitViewMessage = {
      type: type
    };
    this.splitViewStream.next(message);
  }

}
