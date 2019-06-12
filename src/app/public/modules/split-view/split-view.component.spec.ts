import {
  async,
  ComponentFixture,
  TestBed,
  tick,
  fakeAsync
} from '@angular/core/testing';

import {
  expect,
  SkyAppTestUtility
} from '@skyux-sdk/testing';

import {
  By
} from '@angular/platform-browser';

import {
  SplitViewFixturesModule
} from './fixtures/split-view-fixtures.module';

import {
  SplitViewFixtureComponent
} from './fixtures/split-view.fixture';
import { SkySplitViewComponent } from './split-view.component';
import { DebugElement } from '@angular/core';

import {
  MockSkyMediaQueryService
} from '@skyux/core/testing/mock-media-query.service';
import { SkyMediaBreakpoints, SkyMediaQueryService } from '@skyux/core';

let mockQueryService: MockSkyMediaQueryService;

describe('Split view component', () => {
  let component: SplitViewFixtureComponent;
  let fixture: ComponentFixture<SplitViewFixtureComponent>;
  let minWidth = 100;
  let maxWidth: number;
  mockQueryService = new MockSkyMediaQueryService();

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        SplitViewFixturesModule
      ],
      providers: [
        { provide: SkyMediaQueryService, useValue: mockQueryService}
      ]
    });

    fixture = TestBed.createComponent(SplitViewFixtureComponent);
    component = fixture.componentInstance;
    maxWidth = getMaxWidth();
  }));

  // #region helpers
  function getSplitViewElement(): HTMLElement {
    return document.querySelector('.sky-split-view') as HTMLElement;
  }

  function getListPanel(): HTMLElement {
    return document.querySelector('.sky-split-view-list') as HTMLElement;
  }

  // function getSplitViewWorkspaceElement(): HTMLElement {
  //   return document.querySelector('.sky-split-view-workspace') as HTMLElement;
  // }

  function getResizeHandle(): DebugElement {
    return fixture.debugElement.query(By.css('.sky-split-view-resize-handle'));
  }

  function getMaxWidth(): number {
    const splitViewElement = getSplitViewElement();
    return splitViewElement.clientWidth - 100;
  }

  function dispatchMouseEvent(eventType: string, clientXArg: number): void {
    let evt = document.createEvent('MouseEvents');
    evt.initMouseEvent(eventType, false, false, window, 0, 0, 0, clientXArg,
      0, false, false, false, false, 0, undefined);
    document.dispatchEvent(evt);
    fixture.detectChanges();
  }

  function resizeList(deltaX: number): void {
    // Mousedown.
    const resizeHandle = getResizeHandle();
    let axis = getElementCords(resizeHandle);
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
    dispatchMouseEvent('mousemove', axis.x + deltaX);

    // Mouseup.
    dispatchMouseEvent('mouseup', axis.x + deltaX);

    // Clear any timers that may still be pending.
    tick();
  }

  function getElementCords(elementRef: any) {
    const rect = (elementRef.nativeElement as HTMLElement).getBoundingClientRect();
    const coords = {
      x: Math.round(rect.left + (rect.width / 2)),
      y: Math.round(rect.top + (rect.height / 2))
    };

    return coords;
  }
  // #endregion

  describe('before properties initialize', () => {
    it('should resize list panel when listPanelWidth input property has a numeric value', fakeAsync(() => {
      component.listWidth = 500;
      fixture.detectChanges();
      tick();
      const listPanelElement = getListPanel();

      expect(listPanelElement.style.width).toBe('500px');
    }));
  });

  describe('after properties initialize', () => {

    // Runs the initial getters.
    beforeEach(fakeAsync(() => {
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();
    }));

    it('should default the list panel width to 320 pixels', fakeAsync(() => {
      const listPanelElement = getListPanel();

      expect(listPanelElement.style.width).toBe('320px');
    }));

    it('should resize list panel when listPanelWidth input property has a numeric value', fakeAsync(() => {
      component.listWidth = 500;
      fixture.detectChanges();
      tick();
      const listPanelElement = getListPanel();

      expect(listPanelElement.style.width).toBe('500px');
    }));

    //   it('should accept configuration options for aria-labelledBy, aria-describedby, role, and width',
    //   fakeAsync(() => {
    //     const expectedLabel = 'customlabelledby';
    //     const expectedDescribed = 'customdescribedby';
    //     const expectedRole = 'customrole';
    //     const expectedDefault = 500;

    //     openFlyout({
    //       ariaLabelledBy: expectedLabel,
    //       ariaDescribedBy: expectedDescribed,
    //       ariaRole: expectedRole,
    //       defaultWidth: expectedDefault
    //     });

    //     const listPanelElement = getSplitViewlistPanelElement();

    //     expect(listPanelElement.getAttribute('aria-labelledby'))
    //       .toBe(expectedLabel);
    //     expect(listPanelElement.getAttribute('aria-describedby'))
    //       .toBe(expectedDescribed);
    //     expect(listPanelElement.getAttribute('role'))
    //       .toBe(expectedRole);
    //     expect(listPanelElement.style.width)
    //       .toBe(expectedDefault + 'px');
    //   })
    // );

    it('should resize when handle is dragged', fakeAsync(() => {
      const moveSpy = spyOn(SkySplitViewComponent.prototype, 'onMouseMove').and.callThrough();
      const mouseUpSpy = spyOn(SkySplitViewComponent.prototype, 'onHandleRelease').and.callThrough();
      const listPanelElement = getListPanel();
      const resizeHandle = getResizeHandle().nativeElement;

      resizeList(100);

      // Expect list panel width to be 100 more than default (320).
      // Expect resize handle to move 100 pixels to the right.
      expect(listPanelElement.style.width).toBe('420px');
      expect(resizeHandle.style.left).toBe('413px');

      resizeList(-100);

      // Expect list panel and resize handle to return to their defaults.
      expect(listPanelElement.style.width).toBe('320px');
      expect(resizeHandle.style.left).toBe('313px');
      expect(moveSpy).toHaveBeenCalled();
      expect(mouseUpSpy).toHaveBeenCalled();
    }));

    it('should not resize on mousemove unless the resize handle was clicked', fakeAsync(() => {
      const moveSpy = spyOn(SkySplitViewComponent.prototype, 'onMouseMove').and.callThrough();
      const mouseUpSpy = spyOn(SkySplitViewComponent.prototype, 'onHandleRelease').and.callThrough();
      const listPanelElement = getListPanel();
      const resizeHandle = getResizeHandle().nativeElement;

      // Mousemove.
      dispatchMouseEvent('mousemove', 999);

      // Expect list panel width and handle to remain at default.
      expect(listPanelElement.style.width).toBe('320px');
      expect(resizeHandle.style.left).toBe('313px');

      // Mouseup.
      dispatchMouseEvent('mouseup', 999);

      expect(moveSpy).not.toHaveBeenCalled();
      expect(mouseUpSpy).not.toHaveBeenCalled();
    }));

    it('should resize list panel when range input is changed', fakeAsync(() => {
      const listPanelElement = getListPanel();
      const resizeInput = getResizeHandle().nativeElement as HTMLInputElement;

      resizeInput.value = '400';
      SkyAppTestUtility.fireDomEvent(resizeInput, 'input');
      fixture.detectChanges();
      tick();
      expect(listPanelElement.style.width).toBe('400px');

      resizeInput.value = '500';
      SkyAppTestUtility.fireDomEvent(resizeInput, 'input');
      fixture.detectChanges();
      tick();
      expect(listPanelElement.style.width).toBe('500px');
    }));

    it('should have correct aria-labels on resizing range input', fakeAsync(() => {
      const listPanelElement = getListPanel();
      const resizeInput = getResizeHandle().nativeElement as HTMLInputElement;

      expect(listPanelElement.style.width).toBe('320px');
      expect(resizeInput.getAttribute('aria-controls')).toBe(listPanelElement.id);
      expect(resizeInput.getAttribute('aria-valuenow')).toBe('320');
      expect(resizeInput.getAttribute('aria-valuemax')).toBe(maxWidth.toString());
      expect(resizeInput.getAttribute('aria-valuemin')).toBe(minWidth.toString());
      expect(resizeInput.getAttribute('max')).toBe(maxWidth.toString());
      expect(resizeInput.getAttribute('min')).toBe(minWidth.toString());
    }));

    it('should respect minimum and maximum when resizing', fakeAsync(() => {
      const listPanelElement = getListPanel();
      const resizeHandle = getResizeHandle().nativeElement;

      // Attmpt to resize list panel larger than maximum.
      resizeList(maxWidth + 99);

      // Expect list panel width and handle to remain at default.
      expect(listPanelElement.style.width).toBe('320px');
      expect(resizeHandle.style.left).toBe('313px');

      // Attmpt to resize list panel smaller than minimum.
      resizeList(maxWidth - 99);

      // Expect list panel width and handle to remain at default.
      expect(listPanelElement.style.width).toBe('320px');
      expect(resizeHandle.style.left).toBe('313px');
    }));

    it('resize handle and workspace panel should be hidden when screen size changes to xs', fakeAsync(() => {
      mockQueryService.fire(SkyMediaBreakpoints.xs);
      fixture.detectChanges();
      const listPanelElement = getListPanel();
      const resizeHandle = getResizeHandle();

      expect(resizeHandle).toBeNull();
      expect(listPanelElement).toBeNull();
    }));

    it('resize handle and workspace panel should be revealed when screen size changes back to md from xs', fakeAsync(() => {
      mockQueryService.fire(SkyMediaBreakpoints.xs);
      fixture.detectChanges();
      mockQueryService.fire(SkyMediaBreakpoints.md);
      fixture.detectChanges();
      const listPanelElement = getListPanel();
      const resizeHandle = getResizeHandle();

      expect(resizeHandle).not.toBeNull();
      expect(listPanelElement).not.toBeNull();
    }));

    // it('resize handle should not be visible when on xs screen size', fakeAsync(() => {
    //   mockQueryService.fire(SkyMediaBreakpoints.xs);
    //   fixture.detectChanges();
    //   const resizeHandle = getResizeHandle();

    //   expect(resizeHandle).toBeNull();
    // }));

    // it('should set iframe styles correctly during dragging', fakeAsync(() => {
    //   openFlyout({}, true);
    //   const iframe = getIframe();

    //   expect(iframe.style.pointerEvents).toBeFalsy();

    //   grabDragHandle(1000);

    //   expect(iframe.style.pointerEvents).toBe('none');

    //   dragHandle(500);

    //   expect(iframe.style.pointerEvents).toBe('none');

    //   releaseDragHandle();

    //   expect(iframe.style.pointerEvents).toBeFalsy();
    // }));

    it ('should set focus in the workspace when messages are sent to the stream', fakeAsync(() => {
      // TODO
    }));

    it ('should disable/enable iterator buttons when messages are sent to the stream', fakeAsync(() => {
      // TODO
    }));

    it ('should not show the iterator buttons and back link on larger screens', fakeAsync(() => {
        // TODO
    }));

    it ('should show the iterator buttons and back link on smaller screens', fakeAsync(() => {
      // TODO
    }));

    it ('should emit when the iterator buttons are clicked', fakeAsync(() => {
      // TODO
    }));

    it ('should show the list when the back link is clicked', fakeAsync(() => {
      // TODO
    }));

    it ('should convert to responsive mode when the window is resized to xs size', fakeAsync(() => {
      // TODO
    }));

    it ('should convert to normal display mode when the window is resized larger than xs size', fakeAsync(() => {
      // TODO
    }));

    it('should pass accessibility', async(() => {
      fixture.detectChanges();
      expect(fixture.nativeElement).toBeAccessible();
    }));

    it('should pass accessibility when in responsive mode', async(() => {
      fixture.detectChanges();
      expect(fixture.nativeElement).toBeAccessible();
    }));

  });

});
