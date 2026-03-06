import type { PuppeteerBrowser } from './puppeteer-browser.interface';
import type { PuppeteerLaunchOptions } from './puppeteer-launch-options.interface';

export interface PuppeteerModule {
  launch(options: PuppeteerLaunchOptions): Promise<PuppeteerBrowser>;
}
