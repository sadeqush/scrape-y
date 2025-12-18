import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import { CheerioAPI } from 'cheerio';
import { BaseScraper } from '../base/base-scraper';
import { ProductData, ScraperConfig } from '../interfaces/scraper.interface';

@Injectable()
export class RyansScraper extends BaseScraper {
  protected siteConfig: ScraperConfig = {
    baseUrl: 'https://www.ryans.com',
    selectors: {
      productList: '.category-single-product',
      productName: '.grid-view-text a',
      price: '.pr-text',
    },
    rateLimit: 1500,
    maxRetries: 3,
    timeout: 30000,
  };

  constructor() {
    super('ryans');
  }

  async searchByBrand(
    brandName: string,
    maxPages: number = 1,
  ): Promise<ProductData[]> {
    const allProducts: ProductData[] = [];
    const resultsPerPage = 60;
    let totalNumberOfPages: number | null = null;

    try {
      for (let page = 1; page <= maxPages; page++) {
        const searchUrl = `${this.siteConfig.baseUrl}/search?q=${encodeURIComponent(
          brandName,
        )}&limit=${resultsPerPage}&page=${page}`;

        try {
          const pageProducts = await this.retry(async () => {
            const $ = await this.loadPage(searchUrl);
            const products: ProductData[] = [];
            if (totalNumberOfPages === null) {
              const totalProductsText = $('.category-pagination-section b')
                .first()
                .text();
              const match = totalProductsText.match(/(\d[\d,]*)/);
              if (match) {
                totalNumberOfPages = Number(match[1].replace(/,/g, ''));
                if (
                  !Number.isNaN(totalNumberOfPages) &&
                  totalNumberOfPages > 0
                ) {
                  maxPages = Math.ceil(totalNumberOfPages / resultsPerPage);
                }
              }
            }

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
                  return;
                }

                const price = this.extractPrice(priceText);

                const product = this.normalizeProductData({
                  name,
                  price,
                  brand: brandName,
                  site: 'ryans',
                });

                products.push(product);
              } catch (error) {
                this.logger.warn(
                  `Failed to parse product ${i}: ${error.message}`,
                );
              }
            });

            return products;
          });

          allProducts.push(...pageProducts);
          this.logger.log(
            `Scraped ${pageProducts.length} products for brand "${brandName}" on page ${page}`,
          );

          if (pageProducts.length === 0) {
            break;
          }
        } catch (error) {
          this.logger.error(`Failed to scrape page ${page}: ${error.message}`);
          break;
        }
      }

      this.logger.log(
        `Total: Scraped ${allProducts.length} products for brand "${brandName}"`,
      );
      return allProducts;
    } finally {
      await this.closeBrowser();
    }
  }

  private async loadPage(url: string): Promise<CheerioAPI> {
    try {
      return await this.fetchHtml(url);
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 403) {
        this.logger.warn(
          `Received 403 for ${url}, falling back to headless browser`,
        );
        const page = await this.fetchWithBrowser(url);
        const content = await page.content();
        await page.context().close();
        return cheerio.load(content);
      }

      throw error;
    }
  }
}
