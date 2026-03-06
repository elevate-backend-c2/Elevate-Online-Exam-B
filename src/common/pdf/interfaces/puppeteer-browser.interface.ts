import type { PuppeteerPage } from './puppeteer-page.interface';

export interface PuppeteerBrowser {
  newPage(): Promise<PuppeteerPage>;
  close(): Promise<void>;
}
