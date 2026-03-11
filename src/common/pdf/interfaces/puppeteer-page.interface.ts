import type { PuppeteerPdfOptions } from './puppeteer-pdf-options.interface';
import type { PuppeteerSetContentOptions } from './puppeteer-set-content-options.interface';

export interface PuppeteerPage {
  setContent(
    html: string,
    options?: PuppeteerSetContentOptions,
  ): Promise<void>;
  emulateMediaType(type: string): Promise<void>;
  pdf(options?: PuppeteerPdfOptions): Promise<Uint8Array>;
}
