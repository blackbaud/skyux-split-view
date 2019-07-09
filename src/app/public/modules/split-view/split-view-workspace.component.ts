import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  SkyCoreAdapterService,
  SkyMediaQueryService
} from '@skyux/core';

import {
  Subject
} from 'rxjs';

import {
  SkySplitViewMediaQueryService
} from './split-view-media-query.service';

import {
  SkySplitViewService
} from './split-view.service';

@Component({
  selector: 'sky-split-view-workspace',
  templateUrl: 'split-view-workspace.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    SkySplitViewMediaQueryService,
    { provide: SkyMediaQueryService, useExisting: SkySplitViewMediaQueryService }
  ]
})
export class SkySplitViewWorkspaceComponent implements OnDestroy, OnInit {

  // Shows/hides the workspace header when the parent split view is in mobile view.
  public set isMobile(value: boolean) {
    this._isMobile = value;
    this.changeDetectorRef.markForCheck();
  }

  public get isMobile(): boolean {
    return this._isMobile || false;
  }

  @Input()
  public ariaLabel: string;

  public showDrawerButtonClick = new EventEmitter<number>();

  private ngUnsubscribe = new Subject<void>();

  private _isMobile: boolean;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private coreAdapterService: SkyCoreAdapterService,
    private elementRef: ElementRef,
    private splitViewMediaQueryService: SkySplitViewMediaQueryService,
    private splitViewService: SkySplitViewService
  ) {}

  public ngOnInit(): void {
    this.splitViewService.isMobileStream
      .takeUntil(this.ngUnsubscribe)
      .subscribe((mobile: boolean) => {
        this.isMobile = mobile;
        this.changeDetectorRef.markForCheck();
      });
  }

  public ngOnDestroy(): void {
    this.showDrawerButtonClick.complete();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  @HostListener('window:resize', ['$event'])
  public onWindowResize(): void {
    this.updateBreakpoint();
  }

  public updateBreakpoint(): void {
    const width = this.elementRef.nativeElement.clientWidth;
    this.splitViewMediaQueryService.setBreakpointForWidth(width);
    const newDrawerBreakpoint = this.splitViewMediaQueryService.current;
    this.coreAdapterService.setResponsiveContainerClass(this.elementRef, newDrawerBreakpoint);
  }
}
