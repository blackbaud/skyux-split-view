import { expect, SkyHostBrowser, SkyVisualThemeSelector } from '@skyux-sdk/e2e';

import { by, element } from 'protractor';

describe('Split view', () => {
  let currentTheme: string;
  let currentThemeMode: string;

  async function selectTheme(theme: string, mode: string): Promise<void> {
    currentTheme = theme;
    currentThemeMode = mode;

    return SkyVisualThemeSelector.selectTheme(theme, mode);
  }

  function getScreenshotName(name: string): string {
    if (currentTheme) {
      name += '-' + currentTheme;
    }

    if (currentThemeMode) {
      name += '-' + currentThemeMode;
    }

    return name;
  }

  function runTests() {
    it('should match previous screenshot', async (done) => {
      await SkyHostBrowser.scrollTo('#screenshot-split-view');
      await SkyHostBrowser.setWindowBreakpoint('lg');
      expect('#screenshot-split-view').toMatchBaselineScreenshot(done, {
        screenshotName: getScreenshotName('split-view-lg'),
      });
    });

    it('should match previous screenshot (screen: xs)', async (done) => {
      await SkyHostBrowser.scrollTo('#screenshot-split-view');
      await SkyHostBrowser.setWindowBreakpoint('xs');
      expect('#screenshot-split-view').toMatchBaselineScreenshot(done, {
        screenshotName: getScreenshotName('split-view-xs'),
      });
    });

    it('should match previous screenshot when drawer is displayed in mobile view (screen: xs)', async (done) => {
      await SkyHostBrowser.scrollTo('#screenshot-split-view');
      await SkyHostBrowser.setWindowBreakpoint('xs');
      element(
        by.css(
          '#screenshot-split-view .sky-split-view-workspace-header-content .sky-btn'
        )
      ).click();
      await SkyHostBrowser.scrollTo('#screenshot-split-view');
      expect('#screenshot-split-view').toMatchBaselineScreenshot(done, {
        screenshotName: getScreenshotName('split-view-drawer-xs'),
      });
    });
  }

  beforeEach(async () => {
    await SkyHostBrowser.get('visual/split-view/basic');
  });
  runTests();

  describe('when modern theme', () => {
    beforeEach(async () => {
      await selectTheme('modern', 'light');
    });
    runTests();
  });

  describe('when modern theme in dark mode', () => {
    beforeEach(async () => {
      await selectTheme('modern', 'dark');
    });
    runTests();
  });
});
