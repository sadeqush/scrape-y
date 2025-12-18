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
exports.TechLandScraper = void 0;
const common_1 = require("@nestjs/common");
const base_scraper_1 = require("../base/base-scraper");
let TechLandScraper = class TechLandScraper extends base_scraper_1.BaseScraper {
    siteConfig = {
        baseUrl: 'https://www.techlandbd.com',
        selectors: {
            productList: 'div.bg-white.rounded-lg.shadow-sm.overflow-hidden',
            productName: 'a.text-gray-800.font-semibold.text-sm',
            price: 'span.text-lg.font-bold.text-red-600',
            originalPrice: 'span.text-sm.text-gray-500.line-through',
            productLink: 'a[href*="/"]',
            productImage: 'img.w-full.h-48',
            stockStatus: 'div.pt-2.text-sm span',
        },
        rateLimit: 1500,
        maxRetries: 3,
        timeout: 30000,
    };
    constructor() {
        super('techland');
    }
    async searchByBrand(brandName, maxPages = 2) {
        const allProducts = [];
        let calculatedMaxPages = maxPages;
        for (let page = 1; page <= calculatedMaxPages; page++) {
            const searchUrl = `${this.siteConfig.baseUrl}/search/advance/product/result/${encodeURIComponent(brandName)}?page=${page}`;
            try {
                const pageProducts = await this.retry(async () => {
                    const $ = await this.fetchHtml(searchUrl);
                    const products = [];
                    if (page === 1) {
                        const paginationText = $('div').filter((i, elem) => {
                            const text = $(elem).text().trim();
                            return /Showing\s+\d+\s+out\s+of\s+\d+\s+products?/i.test(text);
                        }).first().text().trim();
                        if (paginationText) {
                            const match = paginationText.match(/Showing\s+(\d+)\s+out\s+of\s+(\d+)\s+products?/i);
                            if (match) {
                                const x = parseInt(match[1], 10);
                                const y = parseInt(match[2], 10);
                                if (x > 0 && y > 0) {
                                    calculatedMaxPages = Math.ceil(y / x);
                                    this.logger.log(`Calculated maxPages: ${calculatedMaxPages} (${y} total products, ${x} per page)`);
                                }
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
                            const originalPriceText = $elem
                                .find(this.siteConfig.selectors.originalPrice)
                                .text()
                                .trim();
                            const productUrlRaw = $elem
                                .find(this.siteConfig.selectors.productLink)
                                .first()
                                .attr('href');
                            const imageUrl = $elem
                                .find(this.siteConfig.selectors.productImage)
                                .attr('src');
                            const stockText = $elem
                                .find(this.siteConfig.selectors.stockStatus)
                                .text()
                                .trim();
                            const price = this.extractPrice(priceText);
                            const originalPrice = originalPriceText ? this.extractPrice(originalPriceText) : undefined;
                            const product = this.normalizeProductData({
                                name,
                                price,
                                originalPrice,
                                brand: brandName,
                                site: 'techland',
                                url: productUrlRaw ? this.normalizeUrl(productUrlRaw) : undefined,
                                imageUrl: imageUrl ? this.normalizeUrl(imageUrl) : undefined,
                                inStock: stockText.toLowerCase().includes('in stock'),
                            });
                            products.push(product);
                        }
                        catch (error) {
                            this.logger.warn(`Failed to parse product ${i}: ${error.message}`);
                        }
                    });
                    return products;
                });
                allProducts.push(...pageProducts);
                this.logger.log(`Scraped ${pageProducts.length} products for brand "${brandName}" on page ${page}`);
                if (pageProducts.length === 0) {
                    break;
                }
            }
            catch (error) {
                this.logger.error(`Failed to scrape page ${page}: ${error.message}`);
                break;
            }
        }
        this.logger.log(`Total: Scraped ${allProducts.length} products for brand "${brandName}"`);
        return allProducts;
    }
};
exports.TechLandScraper = TechLandScraper;
exports.TechLandScraper = TechLandScraper = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], TechLandScraper);
//# sourceMappingURL=techland.scraper.js.map