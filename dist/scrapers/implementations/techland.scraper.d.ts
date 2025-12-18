import { BaseScraper } from '../base/base-scraper';
import { ProductData, ScraperConfig } from '../interfaces/scraper.interface';
export declare class TechLandScraper extends BaseScraper {
    protected siteConfig: ScraperConfig;
    constructor();
    searchByBrand(brandName: string, maxPages?: number): Promise<ProductData[]>;
}
