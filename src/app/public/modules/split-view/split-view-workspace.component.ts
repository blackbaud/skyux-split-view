import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy
} from '@angular/core';

import {
  SkyCoreAdapterService,
  SkyMediaQueryService
} from '@skyux/core';

import {
  SkySplitViewMediaQueryService
} from './split-view-media-query.service';

@Component({
  selector: 'sky-split-view-workspace',
  templateUrl: 'split-view-workspace.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    SkySplitViewMediaQueryService,
    { provide: SkyMediaQueryService, useExisting: SkySplitViewMediaQueryService }
  ]
})
export class SkySplitViewWorkspaceComponent implements OnDestroy {

  // Shows/hides the workspace header when the parent split view is in mobile view.
  public set isMobile(value: boolean) {
    this._isMobile = value;
  }

  public get isMobile(): boolean {
    return this._isMobile || false;
  }

  @Input()
  public ariaLabel: string;

  public showDrawerButtonClick = new EventEmitter<number>();

  public animationEnterComplete = new EventEmitter<number>();

  private _isMobile: boolean;

  constructor(
    private coreAdapterService: SkyCoreAdapterService,
    private elementRef: ElementRef,
    private splitViewMediaQueryService: SkySplitViewMediaQueryService
  ) {}

  public ngOnDestroy(): void {
    this.animationEnterComplete.complete();
    this.showDrawerButtonClick.complete();
  }

  public onShowDrawerButtonClick(): void {
    this.showDrawerButtonClick.emit();
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
