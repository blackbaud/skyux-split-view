import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  EventEmitter
} from '@angular/core';

import {
  animate,
  style,
  transition,
  trigger
} from '@angular/animations';

import {
  SkyCoreAdapterService,
  SkyMediaBreakpoints,
  SkyMediaQueryService
} from '@skyux/core';

import {
  Observable
} from 'rxjs/Observable';

import {
  Subject
} from 'rxjs/Subject';

import {
  Subscription
} from 'rxjs/Subscription';

import 'rxjs/add/operator/takeUntil';

import 'rxjs/add/operator/takeWhile';

import 'rxjs/add/observable/fromEvent';

import {
  SkySplitViewBeforeWorkspaceCloseHandler,
  SkySplitViewMessage,
  SkySplitViewMessageType
} from './types';

let nextId = 0;

@Component({
  selector: 'sky-split-view',
  templateUrl: './split-view.component.html',
  styleUrls: ['./split-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger(
      'blockAnimationOnLoad', [
        transition(':enter', [])
      ]
    ),
    trigger(
      'listEnter', [
        transition(`void => *`, [
          style({transform: 'translate(-100%)'}),
          animate('150ms ease-in')
        ])
      ]
    ),
    trigger(
      'workspaceEnter', [
        transition(`void => *`, [
          style({transform: 'translate(100%)'}),
          animate('150ms ease-in')
        ])
      ]
    )
  ]
})
export class SkySplitViewComponent implements OnInit, AfterViewInit, OnDestroy {

  public appSettings: any;

  public splitViewId: string = `sky-split-view-${++nextId}`;

  // Max needs to start as something to allow input range to work.
  // This value is updated as soon as the user takes action.
  public listWidthMax = 9999;

  public listWidthMin = 100;

  public listWidthDefault = 320;

  public iteratorNextButtonDisabled = false;

  public iteratorPreviousButtonDisabled = false;

  @Output()
  public iteratorNextButtonClick = new EventEmitter<void>();

  @Output()
  public iteratorPreviousButtonClick = new EventEmitter<void>();

  public set isListVisible(value: boolean) {
    this._listVisible = value;
  }

  public get isListVisible() {
    return !this.isMobile || this._listVisible;
  }

  public get workspaceVisible() {
    return !this.isMobile || !this._listVisible;
  }

  @Input()
  public set listWidth(value: number) {
    if (value) {
      this._listWidth = value > this.listWidthMin ? value : this.listWidthMin;
    }
  }
  public get listWidth() {
    if (this.isMobile) {
      return undefined;
    } else {
      return this._listWidth || this.listWidthDefault;
    }
  }

  @Input()
  public listPanelResizable: number;

  @Input()
  public messageStream = new Subject<SkySplitViewMessage>();

  public isDragging = false;

  @Output()
  public beforeWorkspaceClose = new EventEmitter<SkySplitViewBeforeWorkspaceCloseHandler>();

  private _listWidth: number;

  private xCoord = 0;

  private isMobile = false;

  private _listVisible = true;

  private ngUnsubscribe = new Subject<void>();

  private mediaQueryServiceSubscription: Subscription;

  private widthTolerance = 100;

  constructor(
    private adapterService: SkyCoreAdapterService,
    private changeDetectorRef: ChangeDetectorRef,
    private elementRef: ElementRef,
    private mediaQueryService: SkyMediaQueryService
  ) { }

  public ngOnInit(): void {
    this.mediaQueryServiceSubscription = this.mediaQueryService.subscribe(breakpoint => {
      const nowMobile = breakpoint === SkyMediaBreakpoints.xs;

      if (nowMobile && !this.isMobile) {
        // switching to mobile
        this.isListVisible = false;

      } else if (!nowMobile && this.isMobile) {
        // switching to widescreen
        this.isListVisible = true;
      }

      this.isMobile = nowMobile;
      this.changeDetectorRef.markForCheck();
    });

    this.messageStream
      .takeUntil(this.ngUnsubscribe)
      .subscribe((message: SkySplitViewMessage) => {
        this.handleIncomingMessages(message);
      });
  }

  public ngAfterViewInit(): void {
    this.setListViewMaxWidth();
  }

  public ngOnDestroy(): void {
    this.mediaQueryServiceSubscription.unsubscribe();

    this.iteratorNextButtonClick.complete();
    this.iteratorPreviousButtonClick.complete();
    this.beforeWorkspaceClose.complete();

    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public onMouseDown(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    // if (this.flyoutMediaQueryService.isWidthWithinBreakpiont(window.innerWidth,
    //   SkyMediaBreakpoints.xs)) {
    //     return;
    // }

    this.setListViewMaxWidth();
    this.isDragging = true;
    this.xCoord = event.clientX;

    // this.adapter.toggleIframePointerEvents(false);

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
    if (!this.isDragging) {
      return;
    }

    const offsetX = event.clientX - this.xCoord;
    let width = this.listWidth;

    width += offsetX;

    if (width < this.listWidthMin || width > this.listWidthMax) {
      return;
    }

    this.listWidth = width;

    // this.updateBreakpointAndResponsiveClass(this.flyoutWidth);

    this.xCoord = event.clientX;
    this.changeDetectorRef.markForCheck();
  }

  public onHandleRelease(event: MouseEvent): void {
    this.isDragging = false;
    // this.adapter.toggleIframePointerEvents(true);
    this.changeDetectorRef.markForCheck();
  }

  public onResizeInputChange(event: Event): void {
    this.setListViewMaxWidth();
  }

  public onShowListButtonClick() {

    if (this.beforeWorkspaceClose.observers.length === 0) {
      // this.closed.emit(args);
      // this.closed.complete();
      this.isListVisible = true;
    } else {
      this.beforeWorkspaceClose.emit(new SkySplitViewBeforeWorkspaceCloseHandler(() => {
        // this.closed.emit(args);
        // this.closed.complete();
        this.isListVisible = true;
        this.changeDetectorRef.markForCheck();
      }));
    }
  }

  @HostListener('window:resize', ['$event'])
  public onWindowResize(event: any): void {

    // If window size is smaller than listWidth + tolerance, shrink listWidth.
    if (this.isListVisible && event.target.innerWidth < this.listWidth + this.widthTolerance) {
      this.listWidth = event.target.innerWidth - this.widthTolerance;
    }
    // if (this.flyoutMediaQueryService.isWidthWithinBreakpiont(event.target.innerWidth,
    //   SkyMediaBreakpoints.xs)) {
    //     this.updateBreakpointAndResponsiveClass(event.target.innerWidth);
    // } else {
    //   this.updateBreakpointAndResponsiveClass(this.flyoutWidth);
    // }
  }

  public onWorkspaceEnterComplete(): void {
    // Set focus on workspace panel.
    if (this.workspaceVisible) {
      const applyAutoFocus = this.adapterService.applyAutoFocus(this.elementRef);
      if (!applyAutoFocus) {
        this.adapterService.getFocusableChildrenAndApplyFocus(this.elementRef, 'sky-split-view-workspace');
      }
    }
  }

  public onIteratorNextButtonClick(): void {
    this.iteratorNextButtonClick.emit();
  }

  public onIteratorPreviousButtonClick(): void {
    this.iteratorPreviousButtonClick.emit();
  }

  private setListViewMaxWidth(): void {
    const splitViewElementWidth = this.getElementWidth('.sky-split-view');
    this.listWidthMax = splitViewElementWidth - 100;
    setTimeout(() => {
      this.changeDetectorRef.markForCheck();
    });
  }

  private handleIncomingMessages(message: SkySplitViewMessage) {
    /* tslint:disable-next-line:switch-default */
    switch (message.type) {
      case SkySplitViewMessageType.FocusWorkspace:
        if (this.isMobile) {
          this.isListVisible = false;
        }
        this.changeDetectorRef.markForCheck();
        break;
    }
  }

  private getElementWidth(selector: string): number {
    const element = this.elementRef.nativeElement.querySelector(selector);
    return element.clientWidth;
  }
}
