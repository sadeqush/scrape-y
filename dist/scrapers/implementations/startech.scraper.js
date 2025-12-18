"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StarTechScraper = void 0;
const common_1 = require("@nestjs/common");
const base_scraper_1 = require("../base/base-scraper");
let StarTechScraper = class StarTechScraper extends base_scraper_1.BaseScraper {
    siteConfig = {
        baseUrl: 'https://www.startech.com.bd',
        selectors: {
            productList: '.p-item',
            productName: '.p-item-name a',
            price: '.p-item-price span',
        },
        rateLimit: 1500,
        maxRetries: 3,
        timeout: 30000,
    };
    constructor() {
        super('startech');
    }
    async searchByBrand(brandName, maxPages = 100) {
        const allProducts = [];
        const productLimit = 90;
        let totalNumberOfPages = 1;
        try {
            const firstPageUrl = `${this.siteConfig.baseUrl}/product/search?search=${encodeURIComponent(brandName)}&limit=${productLimit}&page=1`;
            this.logger.log(`Fetching first page for brand "${brandName}" from ${firstPageUrl}`);
            const $firstPage = await this.fetchHtml(firstPageUrl);
            const bottomBarText = $firstPage('.bottom-bar').text().trim();
            const pagesMatch = bottomBarText.match(/\((\d+)\s+Pages?\)/i);
            if (pagesMatch) {
                totalNumberOfPages = parseInt(pagesMatch[1], 10);
                this.logger.log(`Total pages available: ${totalNumberOfPages} for brand "${brandName}"`);
            }
            const pagesToScrape = Math.min(totalNumberOfPages, maxPages);
            for (let currentPage = 1; currentPage <= pagesToScrape; currentPage++) {
                const url = `${this.siteConfig.baseUrl}/product/search?search=${encodeURIComponent(brandName)}&limit=${productLimit}&page=${currentPage}`;
                this.logger.log(`Scraping page ${currentPage}/${pagesToScrape} for brand "${brandName}"`);
                const $ = currentPage === 1 ? $firstPage : await this.fetchHtml(url);
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
                            site: 'startech',
                        });
                        allProducts.push(product);
                    }
                    catch (error) {
                        this.logger.warn(`Failed to parse product ${i}: ${error.message}`);
                    }
                });
                this.logger.log(`Scraped ${allProducts.length} total products so far`);
            }
            this.logger.log(`Completed scraping: ${allProducts.length} products for brand "${brandName}" across ${pagesToScrape} pages`);
            return allProducts;
        }
        catch (error) {
            this.logger.error(`Failed to scrape: ${error.message}`);
            throw error;
        }
    }
};
exports.StarTechScraper = StarTechScraper;
exports.StarTechScraper = StarTechScraper = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], StarTechScraper);
//# sourceMappingURL=startech.scraper.js.map