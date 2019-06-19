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

  it('should match previous screenshot when list is displayed in mobile view (screen: xs)', (done) => {
    SkyHostBrowser.setWindowBreakpoint('xs');
    element(
      by.css('#screenshot-split-view .sky-split-view-workspace-header-content .sky-btn')
    ).click();
    SkyHostBrowser.scrollTo('#screenshot-split-view');
    expect('#screenshot-split-view').toMatchBaselineScreenshot(done, {
      screenshotName: 'split-view-list-xs'
    });
  });
});
