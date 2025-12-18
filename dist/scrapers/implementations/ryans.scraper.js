"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RyansScraper = void 0;
const common_1 = require("@nestjs/common");
const cheerio = __importStar(require("cheerio"));
const base_scraper_1 = require("../base/base-scraper");
let RyansScraper = class RyansScraper extends base_scraper_1.BaseScraper {
    siteConfig = {
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
    async searchByBrand(brandName, maxPages = 1) {
        const allProducts = [];
        const resultsPerPage = 60;
        let totalNumberOfPages = null;
        try {
            for (let page = 1; page <= maxPages; page++) {
                const searchUrl = `${this.siteConfig.baseUrl}/search?q=${encodeURIComponent(brandName)}&limit=${resultsPerPage}&page=${page}`;
                try {
                    const pageProducts = await this.retry(async () => {
                        const $ = await this.loadPage(searchUrl);
                        const products = [];
                        if (totalNumberOfPages === null) {
                            const totalProductsText = $('.category-pagination-section b')
                                .first()
                                .text();
                            const match = totalProductsText.match(/(\d[\d,]*)/);
                            if (match) {
                                totalNumberOfPages = Number(match[1].replace(/,/g, ''));
                                if (!Number.isNaN(totalNumberOfPages) &&
                                    totalNumberOfPages > 0) {
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
        finally {
            await this.closeBrowser();
        }
    }
    async loadPage(url) {
        try {
            return await this.fetchHtml(url);
        }
        catch (error) {
            const status = error?.response?.status;
            if (status === 403) {
                this.logger.warn(`Received 403 for ${url}, falling back to headless browser`);
                const page = await this.fetchWithBrowser(url);
                const content = await page.content();
                await page.context().close();
                return cheerio.load(content);
            }
            throw error;
        }
    }
};
exports.RyansScraper = RyansScraper;
exports.RyansScraper = RyansScraper = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], RyansScraper);
//# sourceMappingURL=ryans.scraper.js.map