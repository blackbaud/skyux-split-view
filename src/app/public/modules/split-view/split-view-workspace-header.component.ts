import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnDestroy,
  Output,
  Input
} from '@angular/core';

@Component({
  selector: 'sky-split-view-workspace-header',
  templateUrl: 'split-view-workspace-header.component.html',
  styleUrls: ['split-view-workspace-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkySplitViewWorkspaceHeaderComponent implements OnDestroy {
  @Output()
  public showDrawerButtonClick = new EventEmitter<void>();

  @Input()
  public backButtonText: string;

  public onShowDrawerButtonClick(): void {
    this.showDrawerButtonClick.emit();
  }

  public ngOnDestroy(): void {
    this.showDrawerButtonClick.complete();
  }
}
