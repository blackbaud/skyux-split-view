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
  SkyCoreAdapterService,
  SkyMediaBreakpoints,
  SkyMediaQueryService
} from '@skyux/core';

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
  SkySplitViewDrawerComponent
} from './split-view-drawer.component';

import {
  SkySplitViewWorkspaceComponent
} from './split-view-workspace.component';

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
  public messageStream = new Subject<SkySplitViewMessage>();

  @Output()
  public beforeWorkspaceClose = new EventEmitter<SkySplitViewBeforeWorkspaceCloseHandler>();

  public set isDrawerVisible(value: boolean) {
    this._drawerVisible = value;
  }

  public get isDrawerVisible() {
    return !this.isMobile || this._drawerVisible;
  }

  public isMobile = false;

  @ContentChild(SkySplitViewDrawerComponent)
  public drawerComponent: SkySplitViewDrawerComponent;

  public nextButtonDisabled = false;

  public previousButtonDisabled = false;

  @ContentChild(SkySplitViewWorkspaceComponent)
  public workspaceComponent: SkySplitViewWorkspaceComponent;

  public get workspaceVisible() {
    return !this.isMobile || !this._drawerVisible;
  }

  private animationComplete = new Subject<void>();

  private ngUnsubscribe = new Subject<void>();

  private mediaQueryServiceSubscription: Subscription;

  private _drawerVisible = true;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private coreAdapterService: SkyCoreAdapterService,
    private elementRef: ElementRef,
    private mediaQueryService: SkyMediaQueryService
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
      this.drawerComponent.isMobile = this.isMobile;
      this.workspaceComponent.isMobile = this.isMobile;
      this.changeDetectorRef.markForCheck();
    });

    this.messageStream
      .takeUntil(this.ngUnsubscribe)
      .subscribe((message: SkySplitViewMessage) => {
        this.handleIncomingMessages(message);
      });

    this.updateBreakpoint();
  }

  public ngAfterViewInit(): void {
    // Watch for width changes on drawer and update workspace breakpoints.
    this.drawerComponent.widthChange
      .takeUntil(this.ngUnsubscribe)
      .subscribe(() => {
        this.workspaceComponent.updateBreakpoint();
      });

    this.workspaceComponent.showDrawerButtonClick
      .takeUntil(this.ngUnsubscribe)
      .subscribe(() => {
        this.onShowDrawerButtonClick();
      });

    this.drawerComponent.isMobile = this.isMobile;
    this.workspaceComponent.isMobile = this.isMobile;
  }

  public ngOnDestroy(): void {
    this.mediaQueryServiceSubscription.unsubscribe();
    this.beforeWorkspaceClose.complete();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
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

  public onWorkspaceEnterComplete(): void {
    this.animationComplete.next();
  }

  @HostListener('window:resize', ['$event'])
  public onWindowResize(event: any): void {
    // If window size is smaller than width + tolerance, shrink width.
    if (!this.isMobile && event.target.innerWidth < this.drawerComponent.width + this.drawerComponent.widthTolerance) {
      this.drawerComponent.width = event.target.innerWidth - this.drawerComponent.widthTolerance;
    }
    this.updateBreakpoint();
  }

  public updateBreakpoint(): void {
    const newDrawerBreakpoint = this.mediaQueryService.current;
    this.coreAdapterService.setResponsiveContainerClass(this.elementRef, newDrawerBreakpoint);
  }

  private handleIncomingMessages(message: SkySplitViewMessage) {
    /* tslint:disable-next-line:switch-default */
    switch (message.type) {
      case SkySplitViewMessageType.FocusWorkspace:
        // If mobile, wait until animation is complete then set focus on workspace panel.
        // Otherwise, just set focus right away.
        if (!this.workspaceVisible) {
          this.isDrawerVisible = false;
          this.workspaceComponent.animationEnterComplete
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

  private applyAutofocus(): void {
    const applyAutoFocus = this.coreAdapterService.applyAutoFocus(this.elementRef);
    if (!applyAutoFocus) {
      this.coreAdapterService.getFocusableChildrenAndApplyFocus(this.elementRef, '.sky-split-view-workspace-content');
    }
  }
}
