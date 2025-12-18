import { Injectable } from '@nestjs/common';
import { BaseScraper } from '../base/base-scraper';
import { ProductData, ScraperConfig } from '../interfaces/scraper.interface';

@Injectable()
export class StarTechScraper extends BaseScraper {
  protected siteConfig: ScraperConfig = {
    baseUrl: 'https://www.startech.com.bd',
    selectors: {
      productList: '.p-item',
      productName: '.p-item-name a',
      price: '.p-item-price span',
    },
    rateLimit: 1500, // 1.5 seconds between requests
    maxRetries: 3,
    timeout: 30000,
  };

  constructor() {
    super('startech');
  }

  async searchByBrand(
    brandName: string,
    maxPages: number = 100,
  ): Promise<ProductData[]> {
    const allProducts: ProductData[] = [];
    const productLimit = 90;
    let totalNumberOfPages = 1;

    try {
      // Fetch first page to get total number of pages
      const firstPageUrl = `${this.siteConfig.baseUrl}/product/search?search=${encodeURIComponent(brandName)}&limit=${productLimit}&page=1`;
      this.logger.log(
        `Fetching first page for brand "${brandName}" from ${firstPageUrl}`,
      );

      const $firstPage = await this.fetchHtml(firstPageUrl);

      // Extract total number of pages from pagination info
      const bottomBarText = $firstPage('.bottom-bar').text().trim();
      // Parse text like "Showing 1 to 90 of 150 (2 Pages)"
      const pagesMatch = bottomBarText.match(/\((\d+)\s+Pages?\)/i);
      if (pagesMatch) {
        totalNumberOfPages = parseInt(pagesMatch[1], 10);
        this.logger.log(
          `Total pages available: ${totalNumberOfPages} for brand "${brandName}"`,
        );
      }

      // Limit to maxPages if specified
      const pagesToScrape = Math.min(totalNumberOfPages, maxPages);

      // Loop through all pages
      for (let currentPage = 1; currentPage <= pagesToScrape; currentPage++) {
        const url = `${this.siteConfig.baseUrl}/product/search?search=${encodeURIComponent(brandName)}&limit=${productLimit}&page=${currentPage}`;

        this.logger.log(
          `Scraping page ${currentPage}/${pagesToScrape} for brand "${brandName}"`,
        );

        // Use already fetched first page, otherwise fetch new page
        const $ = currentPage === 1 ? $firstPage : await this.fetchHtml(url);

        // Extract products from current page
        $(this.siteConfig.selectors.productList).each((i, elem) => {
          try {
            const $elem = $(elem);

            const name = $elem
              .find(this.siteConfig.selectors.productName)
              .text()
              .trim();
            const priceText = $elem
              .find(this.siteConfig.selectors.price)
              .first()
              .text()
              .trim();

            if (!name || !priceText) {
              return; // Skip incomplete products
            }

            const price = this.extractPrice(priceText);

            const product = this.normalizeProductData({
              name,
              price,
              brand: brandName,
              site: 'startech',
            });

            allProducts.push(product);
          } catch (error) {
            this.logger.warn(`Failed to parse product ${i}: ${error.message}`);
          }
        });

        this.logger.log(
          `Scraped ${allProducts.length} total products so far`,
        );
      }

      this.logger.log(
        `Completed scraping: ${allProducts.length} products for brand "${brandName}" across ${pagesToScrape} pages`,
      );

      return allProducts;
    } catch (error) {
      this.logger.error(`Failed to scrape: ${error.message}`);
      throw error;
    }
  }
}
