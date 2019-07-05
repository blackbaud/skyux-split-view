import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  SkyAppWindowRef,
  SkyCoreAdapterService,
  SkyMediaBreakpoints,
  SkyMediaQueryService
} from '@skyux/core';

import {
  Observable
} from 'rxjs';

import {
  SkySplitViewMediaQueryService
} from './split-view-media-query.service';

let nextId = 0;

@Component({
  selector: 'sky-split-view-drawer',
  templateUrl: 'split-view-drawer.component.html',
  styleUrls: ['split-view-drawer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    SkySplitViewMediaQueryService,
    { provide: SkyMediaQueryService, useExisting: SkySplitViewMediaQueryService }
  ]
})
export class SkySplitViewDrawerComponent implements AfterViewInit, OnInit, OnDestroy {

  @Input()
  public ariaLabel: string;

  // Shows/hides the resize handle when the parent split view is in mobile view.
  public set isMobile(value: boolean) {
    this._isMobile = value;
    this.changeDetectorRef.markForCheck();
  }

  public get isMobile(): boolean {
    return this._isMobile || false;
  }

  @Input()
  public set width(value: number) {
    if (value) {
      this._width = Number(value);
      this.updateBreakpoint();
      this.widthChanges.emit(this._width);
      this.changeDetectorRef.markForCheck();
    }
  }

  public get width(): number {
    if (this.isMobile) {
      return undefined;
    }
    if (this._width > this.widthMax) {
      return this.widthMax;
    } else if (this._width < this.widthMin) {
      return this.widthMin;
    } else {
      return this._width || this.widthDefault;
    }
  }

  public splitViewDrawerId: string = `sky-split-view-drawer-${++nextId}`;

  public widthChanges = new EventEmitter<number>();

  // Max needs to start as something to allow input range to work.
  // This value is updated as soon as the user takes action.
  public widthMax = 9999;

  public widthMin = 100;

  public widthDefault = 320;

  public widthTolerance = 100;

  private isDragging = false;

  private xCoord = 0;

  private _isMobile: boolean;

  private _width: number;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private coreAdapterService: SkyCoreAdapterService,
    private elementRef: ElementRef,
    private skyWindow: SkyAppWindowRef,
    private splitViewMediaQueryService: SkySplitViewMediaQueryService
  ) {}

  public ngOnInit(): void {
    this.setMaxWidth();
  }

  public ngAfterViewInit(): void {
    this.updateBreakpoint();
  }

  public ngOnDestroy(): void {
    this.widthChanges.complete();
  }

  public onResizeHandleMouseDown(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (this.splitViewMediaQueryService.isWidthWithinBreakpiont(window.innerWidth,
      SkyMediaBreakpoints.xs)) {
        return;
    }

    this.setMaxWidth();
    this.isDragging = true;
    this.xCoord = event.clientX;

    this.coreAdapterService.toggleIframePointerEvents(false);

    Observable
      .fromEvent(document, 'mousemove')
      .takeWhile(() => {
        return this.isDragging;
      })
      .subscribe((moveEvent: any) => {
        this.onMouseMove(moveEvent);
      });

    Observable
      .fromEvent(document, 'mouseup')
      .takeWhile(() => {
        return this.isDragging;
      })
      .subscribe((mouseUpEvent: any) => {
        this.onHandleRelease(mouseUpEvent);
      });
  }

  public onMouseMove(event: MouseEvent): void {
    /* Sanity check */
    /* istanbul ignore if */
    if (!this.isDragging) {
      return;
    }

    const offsetX = event.clientX - this.xCoord;
    let width = this.width;

    width += offsetX;

    if (width < this.widthMin || width > this.widthMax) {
      return;
    }

    this.width = width;

    this.xCoord = event.clientX;
    this.changeDetectorRef.markForCheck();
  }

  public onHandleRelease(event: MouseEvent): void {
    this.isDragging = false;
    this.coreAdapterService.toggleIframePointerEvents(true);
    this.changeDetectorRef.markForCheck();
  }

  public onResizeHandleChange(event: any): void {
    this.width = event.target.value;
    this.setMaxWidth();
  }

  private updateBreakpoint(): void {
    this.splitViewMediaQueryService.setBreakpointForWidth(this.width);
    const newDrawerBreakpoint = this.splitViewMediaQueryService.current;
    this.coreAdapterService.setResponsiveContainerClass(this.elementRef, newDrawerBreakpoint);
  }

  private setMaxWidth(): void {
    this.widthMax = this.skyWindow.nativeWindow.innerWidth - this.widthTolerance;
  }
}
