import { Logger } from '@nestjs/common';
import { AxiosInstance } from 'axios';
import { CheerioAPI } from 'cheerio';
import { Page } from 'playwright';
import { IScraper, ProductData, ScraperConfig } from '../interfaces/scraper.interface';
export declare abstract class BaseScraper implements IScraper {
    protected readonly siteName: string;
    protected abstract siteConfig: ScraperConfig;
    protected readonly logger: Logger;
    protected httpClient: AxiosInstance;
    private browser;
    private lastRequestTime;
    constructor(siteName: string);
    abstract searchByBrand(brandName: string, maxPages?: number): Promise<ProductData[]>;
    protected fetchHtml(url: string): Promise<CheerioAPI>;
    protected fetchWithBrowser(url: string): Promise<Page>;
    protected closeBrowser(): Promise<void>;
    protected extractPrice(text: string): number;
    protected normalizeUrl(url: string): string;
    protected normalizeProductData(raw: Partial<ProductData>): ProductData;
    private respectRateLimit;
    protected sleep(ms: number): Promise<void>;
    protected retry<T>(fn: () => Promise<T>, maxRetries?: number): Promise<T>;
}
