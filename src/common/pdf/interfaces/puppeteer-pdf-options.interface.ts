export interface PuppeteerPdfOptions {
  format?: string;
  printBackground?: boolean;
  margin?: {
    top: string;
    right: string;
    bottom: string;
    left: string;
  };
  preferCSSPageSize?: boolean;
}
