import {
  Injectable,
  OnDestroy
} from '@angular/core';

import {
  Subscription,
  BehaviorSubject,
  Observable
} from 'rxjs';

import {
  SkyMediaBreakpoints,
  SkyMediaQueryService
} from '@skyux/core';

import {
  SkyLibResourcesService
} from '@skyux/i18n';

@Injectable()
export class SkySplitViewService implements OnDestroy {

  public get backButtonTextStream(): Observable<string> {
    return this._backButtonTextStream;
  }

  public drawerVisible = new BehaviorSubject<boolean>(true);

  public set isMobile(value: boolean) {
    this._isMobile = value;
  }

  public get isMobile(): boolean {
    return this._isMobile || false;
  }

  public get isMobileStream(): Observable<boolean> {
    return this._isMobileStream;
  }

  private mediaQueryServiceSubscription: Subscription;

  private _backButtonTextStream = new BehaviorSubject<string>('');

  private _isMobile: boolean;

  private _isMobileStream = new BehaviorSubject<boolean>(false);

  constructor(
    private mediaQueryService: SkyMediaQueryService,
    private resources: SkyLibResourcesService
  ) {
    // Set default back button text.
    this.resources.getString('skyux_split_view_back_to_list').take(1).subscribe(resource => {
      this.updateBackButtonText(resource);
    });

    // Set breakpoint.
    this.mediaQueryServiceSubscription = this.mediaQueryService.subscribe(breakpoint => {
      const nowMobile = breakpoint === SkyMediaBreakpoints.xs;
      if (nowMobile && !this.isMobile) {
        // switching to mobile
        this._isMobileStream.next(true);
        this.drawerVisible.next(false);
      } else if (!nowMobile && this.isMobile) {
        // switching to widescreen
        this._isMobileStream.next(false);
        this.drawerVisible.next(true);
      }
      this.isMobile = nowMobile;
    });
  }

  public ngOnDestroy(): void {
    this.mediaQueryServiceSubscription.unsubscribe();
  }

  public backButtonClick(): void {
    this.drawerVisible.next(true);
  }

  public updateBackButtonText(value: string) {
    this._backButtonTextStream.next(value);
  }

}
