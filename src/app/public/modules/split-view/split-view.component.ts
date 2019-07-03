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
  SkySplitViewDrawerComponent
} from './split-view-drawer.component';

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
      'drawerEnter', [
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
  public backButtonText: string;

  @Input()
  public set drawerWidth(value: number) {
    if (value) {
      this._drawerWidth = value;
      this.updateBreakpoints();
    }
  }

  public get drawerWidth(): number {
    if (this.isMobile) {
      return undefined;
    } else {
      if (this._drawerWidth > this.drawerWidthMax) {
        return this.drawerWidthMax;
      } else if (this._drawerWidth < this.drawerWidthMin) {
        return this.drawerWidthMin;
      } else {
        return this._drawerWidth || this.drawerWidthDefault;
      }
    }
  }

  @Input()
  public messageStream = new Subject<SkySplitViewMessage>();

  @Output()
  public beforeWorkspaceClose = new EventEmitter<SkySplitViewBeforeWorkspaceCloseHandler>();

  public isDragging = false;

  public set isDrawerVisible(value: boolean) {
    this._drawerVisible = value;
  }

  public get isDrawerVisible() {
    return !this.isMobile || this._drawerVisible;
  }

  public isMobile = false;

  @ContentChild(SkySplitViewDrawerComponent)
  public drawerComponent: SkySplitViewDrawerComponent;

  // Max needs to start as something to allow input range to work.
  // This value is updated as soon as the user takes action.
  public drawerWidthMax = 9999;

  public drawerWidthMin = 100;

  public drawerWidthDefault = 320;

  public nextButtonDisabled = false;

  public previousButtonDisabled = false;

  public splitViewId: string = `sky-split-view-${++nextId}`;

  @ContentChild(SkySplitViewWorkspaceComponent)
  public workspaceComponent: SkySplitViewWorkspaceComponent;

  public get workspaceVisible() {
    return !this.isMobile || !this._drawerVisible;
  }

  private animationComplete = new Subject<void>();

  private ngUnsubscribe = new Subject<void>();

  private mediaQueryServiceSubscription: Subscription;

  private widthTolerance = 100;

  @ContentChild(SkySplitViewWorkspaceComponent, { read: ElementRef })
  private workspaceComponentRef: ElementRef;

  private xCoord = 0;

  private _drawerVisible = true;

  private _drawerWidth: number;

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
        this.isDrawerVisible = false;

      } else if (!nowMobile && this.isMobile) {
        // switching to widescreen
        this.isDrawerVisible = true;
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
    this.setDrawerMaxWidth();
  }

  public ngOnDestroy(): void {
    this.mediaQueryServiceSubscription.unsubscribe();
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

    this.setDrawerMaxWidth();
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
    let width = this.drawerWidth;

    width += offsetX;

    if (width < this.drawerWidthMin || width > this.drawerWidthMax) {
      return;
    }

    this.drawerWidth = width;

    this.xCoord = event.clientX;
    this.changeDetectorRef.markForCheck();
  }

  public onHandleRelease(event: MouseEvent): void {
    this.isDragging = false;
    this.coreAdapterService.toggleIframePointerEvents(true);
    this.changeDetectorRef.markForCheck();
  }

  public onResizeHandleChange(event: any): void {
    this.drawerWidth = event.target.value;
    this.setDrawerMaxWidth();
  }

  public onShowDrawerButtonClick() {
    /* istanbul ignore else */
    if (this.beforeWorkspaceClose.observers.length === 0) {
      this.isDrawerVisible = true;
    } else {
      this.beforeWorkspaceClose.emit(new SkySplitViewBeforeWorkspaceCloseHandler(() => {
        this.isDrawerVisible = true;
        this.changeDetectorRef.markForCheck();
      }));
    }
  }

  @HostListener('window:resize', ['$event'])
  public onWindowResize(event: any): void {
    // If window size is smaller than drawerWidth + tolerance, shrink drawerWidth.
    if (this.isDrawerVisible && event.target.innerWidth < this.drawerWidth + this.widthTolerance) {
      this.drawerWidth = event.target.innerWidth - this.widthTolerance;
    }
    this.updateBreakpoints();
  }

  public onWorkspaceEnterComplete(): void {
    this.animationComplete.next();
  }

  private setDrawerMaxWidth(): void {
    this.drawerWidthMax = this.skyWindow.nativeWindow.innerWidth - this.widthTolerance;
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
        if (!this.workspaceVisible) {
          this.isDrawerVisible = false;
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
    }
  }

  private updateBreakpoints(): void {
    // Update drawer component.
    if (this.drawerComponent) {
      this.drawerComponent.updateBreakpoint(this.drawerWidth);
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
