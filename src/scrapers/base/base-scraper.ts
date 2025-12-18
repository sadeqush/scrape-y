import { Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import * as cheerio from 'cheerio';
import { CheerioAPI } from 'cheerio';
import { chromium, Browser, Page } from 'playwright';
import {
  IScraper,
  ProductData,
  ScraperConfig,
} from '../interfaces/scraper.interface';

export abstract class BaseScraper implements IScraper {
  protected abstract siteConfig: ScraperConfig;
  protected readonly logger: Logger;
  protected httpClient: AxiosInstance;
  private browser: Browser | null = null;
  private lastRequestTime: number = 0;

  constructor(protected readonly siteName: string) {
    this.logger = new Logger(`${siteName}Scraper`);
    this.httpClient = axios.create({
      timeout: 30000,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        Referer: 'https://www.google.com/',
        'sec-ch-ua':
          '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-User': '?1',
        'Sec-Fetch-Dest': 'document',
        Connection: 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
    });
  }

  abstract searchByBrand(
    brandName: string,
    maxPages?: number,
  ): Promise<ProductData[]>;

  /**
   * Fetch HTML content using axios and parse with Cheerio
   */
  protected async fetchHtml(url: string): Promise<CheerioAPI> {
    await this.respectRateLimit();

    try {
      this.logger.debug(`Fetching: ${url}`);
      const response = await this.httpClient.get(url);
      return cheerio.load(response.data);
    } catch (error) {
      this.logger.error(`Failed to fetch ${url}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Fetch page using Playwright browser (for JS-heavy sites)
   */
  protected async fetchWithBrowser(url: string): Promise<Page> {
    await this.respectRateLimit();

    try {
      if (!this.browser) {
        this.browser = await chromium.launch({ headless: true });
      }

      const context = await this.browser.newContext({
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      });

      const page = await context.newPage();
      await page.goto(url, { waitUntil: 'networkidle' });

      return page;
    } catch (error) {
      this.logger.error(
        `Failed to fetch with browser ${url}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Close browser instance
   */
  protected async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  /**
   * Extract price from text (handles various formats)
   */
  protected extractPrice(text: string): number {
    if (!text) return 0;

    // Remove currency symbols and commas, extract numbers
    const cleaned = text.replace(/[৳$,\s]/g, '');
    const match = cleaned.match(/[\d.]+/);

    return match ? parseFloat(match[0]) : 0;
  }

  /**
   * Normalize product URL to absolute URL
   */
  protected normalizeUrl(url: string): string {
    if (!url) return '';

    if (url.startsWith('http')) {
      return url;
    }

    if (url.startsWith('//')) {
      return `https:${url}`;
    }

    if (url.startsWith('/')) {
      return `${this.siteConfig.baseUrl}${url}`;
    }

    return `${this.siteConfig.baseUrl}/${url}`;
  }

  /**
   * Normalize product data
   */
  protected normalizeProductData(raw: Partial<ProductData>): ProductData {
    return {
      name: raw.name?.trim() || 'Unknown Product',
      price: raw.price || 0,
      brand: raw.brand?.trim() || '',
      site: this.siteName,
      ...(raw.originalPrice !== undefined && { originalPrice: raw.originalPrice }),
      ...(raw.url && { url: raw.url }),
      ...(raw.imageUrl && { imageUrl: raw.imageUrl }),
      ...(raw.inStock !== undefined && { inStock: raw.inStock }),
      ...(raw.sku && { sku: raw.sku }),
      ...(raw.category && { category: raw.category }),
    };
  }

  /**
   * Respect rate limiting
   */
  private async respectRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    const rateLimit = this.siteConfig.rateLimit || 1000;

    if (timeSinceLastRequest < rateLimit) {
      const delay = rateLimit - timeSinceLastRequest;
      this.logger.debug(`Rate limiting: waiting ${delay}ms`);
      await this.sleep(delay);
    }

    this.lastRequestTime = Date.now();
  }

  /**
   * Sleep utility
   */
  protected sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Retry mechanism for flaky requests
   */
  protected async retry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        this.logger.warn(
          `Attempt ${attempt}/${maxRetries} failed: ${(error as Error).message}`,
        );

        if (attempt < maxRetries) {
          await this.sleep(1000 * attempt); // Exponential backoff
        }
      }
    }

    throw lastError || new Error('All retry attempts failed');
  }
}
