import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  HostListener
} from '@angular/core';

import {
  animate,
  style,
  transition,
  trigger
} from '@angular/animations';

import {
  SkyMediaBreakpoints,
  SkyMediaQueryService
} from '@skyux/core';

import {
  Observable
} from 'rxjs/Observable';

import {
  Subject
} from 'rxjs/Subject';

import 'rxjs/add/operator/takeUntil';

import 'rxjs/add/operator/takeWhile';

import 'rxjs/add/observable/fromEvent';

import {
  SkySplitViewAdapterService
} from './split-view-adapter.service';

import {
  SkySplitViewMessageType, SkySplitViewMessage
} from './types';

let nextId = 0;

@Component({
  selector: 'sky-split-view',
  templateUrl: './split-view.component.html',
  styleUrls: ['./split-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
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
export class SkySplitViewComponent implements OnInit, AfterViewInit {
  public appSettings: any;

  public splitViewId: string = `sky-split-view-${++nextId}`;

  // Max needs to start as something to allow input range to work.
  // This value is updated as soon as the user takes action.
  public listWidthMax = 9999;
  public listWidthMin = 100;
  public listWidthDefault = 320;

  public set listVisible(value: boolean) {
    this._listVisible = value;
  }

  public get listVisible() {
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

  private _listWidth: number;

  private xCoord = 0;

  private isMobile = false;

  private _listVisible = true;

  constructor(
    private adapter: SkySplitViewAdapterService,
    private changeDetectorRef: ChangeDetectorRef,
    private elementRef: ElementRef,
    private mediaQueryService: SkyMediaQueryService
  ) { }

  public ngOnInit(): void {
    this.mediaQueryService.subscribe(breakpoint => {
      const nowMobile = breakpoint === SkyMediaBreakpoints.xs;

      if (nowMobile && !this.isMobile) {
        // switching to mobile
        this.listVisible = false;

      } else if (!nowMobile && this.isMobile) {
        // switching to widescreen
        this.listVisible = true;
      }

      this.isMobile = nowMobile;
      this.changeDetectorRef.markForCheck();
    });

    this.messageStream
      // .takeUntil(this.ngUnsubscribe)
      .subscribe((message: SkySplitViewMessage) => {
        this.handleIncomingMessages(message);
      });
  }

  public ngAfterViewInit(): void {
    this.setListViewMaxWidth();
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
    this.listVisible = true;
  }

  @HostListener('window:resize', ['$event'])
  public onWindowResize(event: any): void {

    // If window size is smaller than listWidth + tolerance, shrink listWidth.
    const tolerance = 100;
    if (this.listVisible && event.target.innerWidth < this.listWidth + tolerance) {
      this.listWidth = event.target.innerWidth - tolerance;
    }
    // if (this.flyoutMediaQueryService.isWidthWithinBreakpiont(event.target.innerWidth,
    //   SkyMediaBreakpoints.xs)) {
    //     this.updateBreakpointAndResponsiveClass(event.target.innerWidth);
    // } else {
    //   this.updateBreakpointAndResponsiveClass(this.flyoutWidth);
    // }
  }

  private setListViewMaxWidth(): void {
    const splitViewElementWidth = this.adapter.getElementWidth(this.elementRef);
    this.listWidthMax = splitViewElementWidth - 100;
    setTimeout(() => {
      this.changeDetectorRef.markForCheck();
    });
  }

  private handleIncomingMessages(message: SkySplitViewMessage) {
    /* tslint:disable-next-line:switch-default */
    switch (message.type) {
      case SkySplitViewMessageType.FocusFirstItemInWorkspace:
        console.log('DO SOMETHING');
        if (this.isMobile) {
          this.listVisible = false;
        }

        // TODO: Create adapter and method to focus on first element. Add a call to that method here!

        this.changeDetectorRef.markForCheck();

        break;
    }
  }
}
