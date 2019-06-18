import {
  by,
  element
} from 'protractor';

import {
  expect,
  SkyHostBrowser
} from '@skyux-sdk/e2e';

describe('Split view', () => {
  it('should match previous screenshot', (done) => {
    SkyHostBrowser.get('visual/split-view');
    SkyHostBrowser.setWindowBreakpoint('lg');
    expect('body').toMatchBaselineScreenshot(done, {
      screenshotName: 'split-view-lg'
    });
  });

  it('should match previous screenshot (screen: xs)', (done) => {
    SkyHostBrowser.get('visual/split-view');
    SkyHostBrowser.setWindowBreakpoint('xs');
    expect('body').toMatchBaselineScreenshot(done, {
      screenshotName: 'split-view-xs'
    });
  });

  it('should match previous screenshot when list is displayed in mobile view (screen: xs)', (done) => {
    SkyHostBrowser.get('visual/split-view');
    SkyHostBrowser.setWindowBreakpoint('xs');
    element(by.css('.sky-split-view-workspace-header-content .sky-btn')).click();
    expect('body').toMatchBaselineScreenshot(done, {
      screenshotName: 'split-view-list-xs'
    });
  });
});
