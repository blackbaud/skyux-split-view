import { DebugElement } from '@angular/core';
import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  ReactiveFormsModule
} from '@angular/forms';

import {
  By
} from '@angular/platform-browser';

import {
  SkySummaryActionBarModule
} from '@skyux/action-bars';

import {
  SkyMediaBreakpoints,
  SkyMediaQueryService
} from '@skyux/core';

import {
  MockSkyMediaQueryService
} from '@skyux/core/testing';

import {
  SkyDefinitionListModule
} from '@skyux/layout';

import {
  SkyRepeaterModule
} from '@skyux/lists';

import {
  SkyConfirmModule
} from '@skyux/modals';

import {
  SkySplitViewModule
} from '@skyux/split-view';

import {
  SkySplitViewFixture
} from './split-view-fixture';

import {
  SplitViewTestComponent
} from './split-view-fixture-test.component';

import {
  SkySplitViewTestingModule
} from './split-view-testing.module';

const DEFAULT_DRAWER_ARIA_LABEL = 'Transaction list';
const DEFAULT_DRAWER_WIDTH = '320px';
const DEFAULT_WORKSPACE_ARIA_LABEL = 'Transaction form';
const DEFAULT_BACK_BUTTON_TEXT = 'Back to list';

fdescribe('SplitView fixture', () => {
  let fixture: ComponentFixture<SplitViewTestComponent>;
  let testComponent: SplitViewTestComponent;
  let mockQueryService: MockSkyMediaQueryService = new MockSkyMediaQueryService();
  let splitViewFixture: SkySplitViewFixture;

  //#region helpers

  function initiateResponsiveMode(): Promise<void> {
    mockQueryService.fire(SkyMediaBreakpoints.xs);
    fixture.detectChanges();
    return fixture.whenStable();
  }

  function getRepeaterItemElements(): DebugElement[] {
    return fixture.debugElement.queryAll(By.css('.sky-repeater-item'));
  }

  async function selectRepeaterItem(index: number): Promise<void> {
    const items = getRepeaterItemElements();
    items[index].nativeElement.click();

    fixture.detectChanges();
    return await fixture.whenStable();
  }

  //#endregion

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [
        SplitViewTestComponent
      ],
      imports: [
        ReactiveFormsModule,
        SkyConfirmModule,
        SkyDefinitionListModule,
        SkyRepeaterModule,
        SkySplitViewModule,
        SkySummaryActionBarModule,
        SkySplitViewTestingModule
      ],
      providers: [
        { provide: SkyMediaQueryService, useValue: mockQueryService }
      ]
    });

    fixture = TestBed.createComponent(
      SplitViewTestComponent
    );
    testComponent = fixture.componentInstance;
    splitViewFixture = new SkySplitViewFixture(fixture, SplitViewTestComponent.dataSkyId);
  });

  it('should allow exensions by default', async () => {
    // testComponent.listWidth = 500;
    // fixture.detectChanges();
    // await fixture.whenStable();

    await selectRepeaterItem(2);

    expect(splitViewFixture.drawer.ariaLabel).toBe(DEFAULT_DRAWER_ARIA_LABEL);
    expect(splitViewFixture.drawer.isVisible).toBeTrue();
    expect(splitViewFixture.drawer.width).toBe(DEFAULT_DRAWER_WIDTH);

    expect(splitViewFixture.workspace.ariaLabel).toBe(DEFAULT_WORKSPACE_ARIA_LABEL);
    expect(splitViewFixture.workspace.backButtonText).toBeUndefined();
    expect(splitViewFixture.workspace.isVisible).toBeTrue();

    await initiateResponsiveMode();

    expect(splitViewFixture.drawer.ariaLabel).toBe(DEFAULT_DRAWER_ARIA_LABEL);
    expect(splitViewFixture.drawer.isVisible).toBeFalse();
    expect(splitViewFixture.drawer.width).toBe('');

    expect(splitViewFixture.workspace.ariaLabel).toBe(DEFAULT_WORKSPACE_ARIA_LABEL);
    expect(splitViewFixture.workspace.backButtonText).toBe(DEFAULT_BACK_BUTTON_TEXT);
    expect(splitViewFixture.workspace.isVisible).toBeTrue();

    await splitViewFixture.openDrawer();

    expect(splitViewFixture.drawer.ariaLabel).toBe(DEFAULT_DRAWER_ARIA_LABEL);
    expect(splitViewFixture.drawer.isVisible).toBeTrue();
    expect(splitViewFixture.drawer.width).toBe('');

    expect(splitViewFixture.workspace.ariaLabel).toBe(DEFAULT_WORKSPACE_ARIA_LABEL);
    expect(splitViewFixture.workspace.backButtonText).toBe(DEFAULT_BACK_BUTTON_TEXT);
    expect(splitViewFixture.workspace.isVisible).toBeFalse();
  });
});
