import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output
} from '@angular/core';

@Component({
  selector: 'sky-split-view-iterator',
  templateUrl: './split-view-iterator.component.html'
})
export class SkySplitViewIteratorComponent implements OnDestroy {

  @Input()
  public nextButtonDisabled: boolean;

  @Input()
  public previousButtonDisabled: boolean;

  @Output()
  public get previousButtonClick(): EventEmitter<void> {
    return this._previousButtonClick;
  }

  private _previousButtonClick = new EventEmitter<void>();

  @Output()
  public get nextButtonClick(): EventEmitter<void> {
    return this._nextButtonClick;
  }

  private _nextButtonClick = new EventEmitter<void>();

  constructor() {}

  public ngOnDestroy(): void {
    this._previousButtonClick.complete();
    this._nextButtonClick.complete();
  }

  public onIteratorPreviousClick(): void {
    if (!this.previousButtonDisabled) {
      this._previousButtonClick.emit();
    }
  }

  public onIteratorNextClick(): void {
    if (!this.nextButtonDisabled) {
      this._nextButtonClick.emit();
    }
  }
}
