import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';

import {
  animate,
  style,
  transition,
  trigger
} from '@angular/animations';

import {
  SkyAppWindowRef,
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

import 'rxjs/add/operator/take';

import 'rxjs/add/operator/takeUntil';

import 'rxjs/add/operator/takeWhile';

import 'rxjs/add/observable/fromEvent';

import {
  SkySplitViewBeforeWorkspaceCloseHandler
} from './types/split-view-before-workspace-close-handler';

import {
  SkySplitViewMessage
} from './types/split-view-message';

import {
  SkySplitViewMessageType
} from './types/split-view-message-type';

import {
  SkySplitViewMediaQueryService
} from './split-view-media-query.service';

import {
  SkySplitViewListComponent
} from './split-view-list.component';

import {
  SkySplitViewWorkspaceComponent
} from './split-view-workspace.component';

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

  @Input()
  public ariaDescribedBy: string;

  @Input()
  public ariaRole: string;

  @Input()
  public ariaLabelledBy: string;

  @Input()
  public set listWidth(value: number) {
    if (value) {
      this._listWidth = value;
      this.updateBreakpoints();
    }
  }

  public get listWidth() {
    if (this.isMobile) {
      return undefined;
    } else {
      if (this._listWidth > this.listWidthMax) {
        return this.listWidthMax;
      } else if (this._listWidth < this.listWidthMin) {
        return this.listWidthMin;
      } else {
        return this._listWidth || this.listWidthDefault;
      }
    }
  }

  @Input()
  public messageStream = new Subject<SkySplitViewMessage>();

  @Output()
  public beforeWorkspaceClose = new EventEmitter<SkySplitViewBeforeWorkspaceCloseHandler>();

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

  public splitViewId: string = `sky-split-view-${++nextId}`;

  public get workspaceVisible() {
    return !this.isMobile || !this._listVisible;
  }

  // Max needs to start as something to allow input range to work.
  // This value is updated as soon as the user takes action.
  public listWidthMax = 9999;

  public listWidthMin = 100;

  public listWidthDefault = 320;

  public nextButtonDisabled = false;

  public previousButtonDisabled = false;

  public isDragging = false;

  public isMobile = false;

  public iteratorNextButtonDisabled = false;

  private animationComplete = new Subject<void>();

  public iteratorPreviousButtonDisabled = false;

  @ContentChild(SkySplitViewListComponent)
  private listComponent: SkySplitViewListComponent;

  private ngUnsubscribe = new Subject<void>();

  private mediaQueryServiceSubscription: Subscription;

  private widthTolerance = 100;

  @ContentChild(SkySplitViewWorkspaceComponent)
  private workspaceComponent: SkySplitViewWorkspaceComponent;

  @ContentChild(SkySplitViewWorkspaceComponent, { read: ElementRef })
  private workspaceComponentRef: ElementRef;

  private xCoord = 0;

  private _listVisible = true;

  private _listWidth: number;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private coreAdapterService: SkyCoreAdapterService,
    private elementRef: ElementRef,
    private mediaQueryService: SkyMediaQueryService,
    private skyWindow: SkyAppWindowRef,
    private splitViewMediaQueryService: SkySplitViewMediaQueryService
  ) {}

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
    this.updateBreakpoints();
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

    if (this.splitViewMediaQueryService.isWidthWithinBreakpiont(window.innerWidth,
      SkyMediaBreakpoints.xs)) {
        return;
    }

    this.setListViewMaxWidth();
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
    let width = this.listWidth;

    width += offsetX;

    if (width < this.listWidthMin || width > this.listWidthMax) {
      return;
    }

    this.listWidth = width;

    this.xCoord = event.clientX;
    this.changeDetectorRef.markForCheck();
  }

  public onHandleRelease(event: MouseEvent): void {
    this.isDragging = false;
    this.coreAdapterService.toggleIframePointerEvents(true);
    this.changeDetectorRef.markForCheck();
  }

  public onResizeInputChange(): void {
    this.setListViewMaxWidth();
  }

  public onShowListButtonClick() {
    /* istanbul ignore else */
    if (this.beforeWorkspaceClose.observers.length === 0) {
      this.isListVisible = true;
    } else {
      this.beforeWorkspaceClose.emit(new SkySplitViewBeforeWorkspaceCloseHandler(() => {
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
    this.updateBreakpoints();
  }

  public onWorkspaceEnterComplete(): void {
    this.animationComplete.next();
  }

  public onIteratorNextButtonClick(): void {
    this.iteratorNextButtonClick.emit();
  }

  public onIteratorPreviousButtonClick(): void {
    this.iteratorPreviousButtonClick.emit();
  }

  private setListViewMaxWidth(): void {
    this.listWidthMax = this.skyWindow.nativeWindow.innerWidth - this.widthTolerance;
    setTimeout(() => {
      this.changeDetectorRef.markForCheck();
    });
  }

  private handleIncomingMessages(message: SkySplitViewMessage) {
    /* tslint:disable-next-line:switch-default */
    switch (message.type) {
      case SkySplitViewMessageType.FocusWorkspace:
        // If mobile, wait until animation is complete then set focus on workspace panel.
        // Otherwise, just set focus right away.
        if (this.isMobile) {
          this.isListVisible = false;
          this.animationComplete
            .take(1)
            .subscribe(() => {
              this.applyAutofocus();
            });
        } else {
          this.applyAutofocus();
        }
        this.changeDetectorRef.markForCheck();
        break;

      case SkySplitViewMessageType.DisableIteratorNextButton:
        this.nextButtonDisabled = true;
        this.changeDetectorRef.markForCheck();
        break;

      case SkySplitViewMessageType.DisableIteratorPreviousButton:
        this.previousButtonDisabled = true;
        this.changeDetectorRef.markForCheck();
        break;

      case SkySplitViewMessageType.EnableIteratorNextButton:
        this.nextButtonDisabled = false;
        this.changeDetectorRef.markForCheck();
        break;

      case SkySplitViewMessageType.EnableIteratorPreviousButton:
        this.previousButtonDisabled = false;
        this.changeDetectorRef.markForCheck();
        break;
    }
  }

  private updateBreakpoints(): void {
    // Update list component.
    if (this.listComponent) {
      this.listComponent.updateBreakpoint(this.listWidth);
    }

    // Update workspace component.
    const workspaceParent = this.workspaceComponentRef.nativeElement.parentElement;
    if (this.workspaceComponent && workspaceParent) {
      this.workspaceComponent.updateBreakpoint(workspaceParent.clientWidth);
    }
  }

  private applyAutofocus(): void {
    const applyAutoFocus = this.coreAdapterService.applyAutoFocus(this.elementRef);
    if (!applyAutoFocus) {
      this.coreAdapterService.getFocusableChildrenAndApplyFocus(this.elementRef, 'sky-split-view-workspace');
    }
  }
}
