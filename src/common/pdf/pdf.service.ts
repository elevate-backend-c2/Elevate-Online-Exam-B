import { Injectable } from '@nestjs/common';
import { readFile } from 'fs/promises';
import * as path from 'path';
import type { CertificateData } from './interfaces/certificate-data.interface';
import type { PuppeteerModule } from './interfaces/puppeteer-module.interface';

@Injectable()
export class PdfService {
  async generatePdf(html: string): Promise<Buffer> {
    const puppeteerModule = (await import('puppeteer')) as unknown as {
      default: PuppeteerModule;
    };
    const puppeteer = puppeteerModule.default;

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();

      await page.setContent(html, {
        waitUntil: 'networkidle0',
        timeout: 30000,
      });
      await page.emulateMediaType('print');

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '0', right: '0', bottom: '0', left: '0' },
        preferCSSPageSize: false,
      });

      return Buffer.from(pdfBuffer);
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    } finally {
      await browser.close();
    }
  }

  async generateCertificate(data: CertificateData): Promise<Buffer> {
    const templatePath = path.join(__dirname, 'templates', 'certificate.html');
    const templateHtml = await readFile(templatePath, 'utf-8');

    const html = templateHtml
      .replace(/\{\{studentName\}\}/g, data.studentName)
      .replace(/\{\{courseName\}\}/g, data.courseName)
      .replace(/\{\{date\}\}/g, data.date)
      .replace(/\{\{certificateId\}\}/g, data.certificateId);

    return this.generatePdf(html);
  }
}
