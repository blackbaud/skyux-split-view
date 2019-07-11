import {
  by,
  element
} from 'protractor';

import {
  expect,
  SkyHostBrowser
} from '@skyux-sdk/e2e';

describe('Split view', () => {
  beforeEach(() => {
    SkyHostBrowser.get('visual/split-view');
    SkyHostBrowser.setWindowBreakpoint('lg');
  });

  it('should match previous screenshot', (done) => {
    SkyHostBrowser.scrollTo('#screenshot-split-view');
    expect('#screenshot-split-view').toMatchBaselineScreenshot(done, {
      screenshotName: 'split-view-lg'
    });
  });

  it('should match previous screenshot (screen: xs)', (done) => {
    SkyHostBrowser.setWindowBreakpoint('xs');
    SkyHostBrowser.scrollTo('#screenshot-split-view');
    expect('#screenshot-split-view').toMatchBaselineScreenshot(done, {
      screenshotName: 'split-view-xs'
    });
  });

  // Extra test to show the responsive drawer.
  // No large version is needed, as the "back" button doesn't exist on larger screens.
  it('should match previous screenshot when drawer is displayed in mobile view (screen: xs)', (done) => {
    SkyHostBrowser.setWindowBreakpoint('xs');
    element(
      by.css('#screenshot-split-view .sky-split-view-workspace-header-content .sky-btn')
    ).click();
    SkyHostBrowser.scrollTo('#screenshot-split-view');
    expect('#screenshot-split-view').toMatchBaselineScreenshot(done, {
      screenshotName: 'split-view-drawer-xs'
    });
  });
});
