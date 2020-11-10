import {
  DebugElement
} from '@angular/core';

import {
  ComponentFixture
} from '@angular/core/testing';

import {
  By
} from '@angular/platform-browser';

import {
  SkyAppTestUtility
} from '@skyux-sdk/testing';

import {
  SkySplitViewFixtureDrawer
} from './split-view-fixture-drawer';

import {
  SkySplitViewFixtureWorkspace
} from './split-view-fixture-workspace';

/**
 * Provides information for and interaction with a SKY UX split view component.
 * By using the fixture API, a test insulates itself against updates to the internals
 * of a component, such as changing its DOM structure.
 */
export class SkySplitViewFixture {
  private _debugEl: DebugElement;

  /*
    // they have access to this via the component interface already
    sendMessage
      - focus workspace

    // they have access to all this via component interface (except isVisible)
    get drawer properties {
      ariaLabel,
      width,
      isVisible
    }

    // they have access to all this via component interface (except isVisible)
    get workspace properties {
      ariaLabel,
      backButtonText,
      isVisible - always visible?

      content: Html,
      footer: Html,
      header: Html,
    }

    // opens or closes the drawer when in small viewport
    toggleDrawer()
  */

  public get drawer(): SkySplitViewFixtureDrawer {
    const drawer = this.getDrawer();

    return {
      ariaLabel: drawer.getAttribute('aria-label'),
      isVisible: !this.drawerIsHidden(),
      width: drawer.style.width
    };
  }

  public get workspace(): SkySplitViewFixtureWorkspace {
    const workspace = this.getWorkspace();
    const backButton = this.getBackToListButton();

    return {
      ariaLabel: workspace.getAttribute('aria-label'),
      backButtonText: SkyAppTestUtility.getText(backButton),
      isVisible: !this.workspaceIsHidden()
    };
  }

  constructor(
    private fixture: ComponentFixture<any>,
    skyTestId: string
  ) {
    this._debugEl = SkyAppTestUtility.getDebugElementByTestId(fixture, skyTestId, 'sky-split-view');

    // the component takes a while to initialize so we need to wait
    this.waitForComponent();
  }

  public async openDrawer(): Promise<void> {
    this.getBackToListButton().click();
    this.fixture.detectChanges();
    await this.fixture.whenStable();
  }

  // #region helpers

  private getDrawer(): HTMLElement {
    return document.querySelector('.sky-split-view-drawer') as HTMLElement;
  }

  private drawerIsHidden(): boolean {
    const listPanel = document.querySelector('.sky-split-view-drawer-flex-container') as HTMLElement;
    return listPanel.hasAttribute('hidden');
  }

  private getWorkspace(): HTMLElement {
    return document.querySelector('.sky-split-view-workspace') as HTMLElement;
  }

  private workspaceIsHidden(): boolean {
    const listPanel = document.querySelector('.sky-split-view-workspace-flex-container') as HTMLElement;
    return listPanel.hasAttribute('hidden');
  }

  private getResizeHandle(fixture: ComponentFixture<any>): DebugElement {
    return fixture.debugElement.query(By.css('.sky-split-view-resize-handle'));
  }

  private getMaxWidth(): number {
    return window.innerWidth - 102; // Account for some padding.
  }

  private dispatchMouseEvent(
    eventType: string,
    clientXArg: number,
    fixture: ComponentFixture<any>
  ): void {
    let evt = document.createEvent('MouseEvents');
    evt.initMouseEvent(eventType, false, false, window, 0, 0, 0, clientXArg,
      0, false, false, false, false, 0, undefined);
    document.dispatchEvent(evt);
    fixture.detectChanges();
  }

  private async resizeList(deltaX: number, fixture: ComponentFixture<any>): Promise<void> {
    // Mousedown.
    const resizeHandle = this.getResizeHandle(fixture);
    let axis = this.getElementCords(resizeHandle);
    let event = {
      target: resizeHandle.nativeElement,
      'clientX': axis.x,
      'clientY': axis.y,
      'preventDefault': function () { },
      'stopPropagation': function () { }
    };
    resizeHandle.triggerEventHandler('mousedown', event);
    fixture.detectChanges();

    // Mousemove.
    this.dispatchMouseEvent('mousemove', axis.x + deltaX, fixture);

    // Mouseup.
    this.dispatchMouseEvent('mouseup', axis.x + deltaX, fixture);

    // Clear any timers that may still be pending.
    fixture.detectChanges();
    await fixture.whenStable();
  }

  private getElementCords(elementRef: any): any {
    const rect = (elementRef.nativeElement as HTMLElement).getBoundingClientRect();
    const coords = {
      x: Math.round(rect.left + (rect.width / 2)),
      y: Math.round(rect.top + (rect.height / 2))
    };

    return coords;
  }

  private getIframe(): HTMLElement {
    return document.querySelector('iframe') as HTMLElement;
  }

  private getFocusedElement(): HTMLElement {
    return document.activeElement as HTMLElement;
  }

  private getBackToListButton(): HTMLButtonElement {
    return document.querySelector('.sky-split-view-workspace-header-content > button') as HTMLButtonElement;
  }

  private getHeader(): HTMLElement {
    return document.querySelector('.sky-split-view-workspace-header-content') as HTMLButtonElement;
  }

  private isWithin(actual: number, base: number, distance: number): boolean {
    return Math.abs(actual - base) <= distance;
  }

  private async waitForComponent(): Promise<void> {
    this.fixture.detectChanges();
    await this.fixture.whenStable();

    this.fixture.detectChanges();
    return this.fixture.whenStable();
  }

  // #endregion
}
