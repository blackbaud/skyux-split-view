import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input
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
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    SkySplitViewMediaQueryService,
    { provide: SkyMediaQueryService, useExisting: SkySplitViewMediaQueryService }
  ]
})
export class SkySplitViewWorkspaceComponent {

  @Input()
  public ariaLabel: string;

  constructor(
    private coreAdapterService: SkyCoreAdapterService,
    private elementRef: ElementRef,
    private splitViewMediaQueryService: SkySplitViewMediaQueryService
  ) {}

  public updateBreakpoint(width: number): void {
    this.splitViewMediaQueryService.setBreakpointForWidth(width);
    const newDrawerBreakpoint = this.splitViewMediaQueryService.current;
    this.coreAdapterService.setResponsiveContainerClass(this.elementRef, newDrawerBreakpoint);
  }
}
