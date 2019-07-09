import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  SkySplitViewService
} from './split-view.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'sky-split-view-workspace-header',
  templateUrl: 'split-view-workspace-header.component.html',
  styleUrls: ['split-view-workspace-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkySplitViewWorkspaceHeaderComponent implements OnDestroy, OnInit {

  public backButtonText: string;

  private ngUnsubscribe = new Subject<void>();

  constructor(
    private splitViewService: SkySplitViewService
  ) {}

  public ngOnInit(): void {
    this.splitViewService.backButtonTextStream
      .takeUntil(this.ngUnsubscribe)
      .subscribe((text: string) => {
        this.backButtonText = text;
      });
  }

  public onShowDrawerButtonClick(): void {
    this.splitViewService.backButtonClick();
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
