import {
  AfterViewInit,
  Component,
  ChangeDetectorRef
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
  SkySplitViewMessageType
} from '../../public/modules/split-view/types/split-view-message-type';

import {
  SkySplitViewMessage
} from '../../public/modules/split-view/types/split-view-message';

@Component({
  selector: 'split-view-with-repeater-visual',
  templateUrl: './split-view-with-repeater-visual.component.html',
  styleUrls: ['./split-view-visual.component.scss']
})
export class SplitViewWithRepeaterVisualComponent implements AfterViewInit {

  public splitViewStream = new Subject<SkySplitViewMessage>();

  public hasUnsavedWork = false;

  public width: number;

  public items = [
    { id: 1, name: 'Jennifer Standley', amount: 12.45, date: '04/28/2019' },
    { id: 2, name: 'Jennifer Standley', amount: 52.39, date: '04/22/2019' },
    { id: 3, name: 'Jennifer Standley', amount: 9.12, date: '04/09/2019' },
    { id: 4, name: 'Jennifer Standley', amount: 193.00, date: '03/27/2019' },
    { id: 5, name: 'Jennifer Standley', amount: 19.89, date: '03/11/2019' },
    { id: 6, name: 'Jennifer Standley', amount: 214.18, date: '02/17/2019' },
    { id: 7, name: 'Jennifer Standley', amount: 4.53, date: '02/26/2019' }
  ];

  public set activeIndex(value: number) {
    this._activeIndex = value;
    this.activeRecord = this.items[this._activeIndex];
  }

  public get activeIndex(): number {
    return this._activeIndex;
  }

  public activeRecord: any;

  private _activeIndex = 0;

  constructor(
    public confirmService: SkyConfirmService,
    public changeDetectorRef: ChangeDetectorRef
  ) {
    this.activeIndex = 0;
  }

  public ngAfterViewInit(): void {
  }

  public onItemClick(index: number) {
    if (this.hasUnsavedWork && index !== this.activeIndex) {
      this.confirmService.open({
        message: 'You have unsaved work. Would you like to save it before you change records?',
        type: SkyConfirmType.YesCancel
      }).closed.subscribe((closeArgs: SkyConfirmCloseEventArgs) => {
        if (closeArgs.action.toLowerCase() === 'yes') {
          this.activeIndex = index;
          this.setFocusInWorkspace();
        }
      });
    } else {
      this.activeIndex = index;
      this.setFocusInWorkspace();
    }
  }

  private setFocusInWorkspace(): void {
    const message: SkySplitViewMessage = {
      type: SkySplitViewMessageType.FocusWorkspace
    };
    this.splitViewStream.next(message);
  }

}
