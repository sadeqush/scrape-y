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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseScraper = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const playwright_1 = require("playwright");
class BaseScraper {
    siteName;
    logger;
    httpClient;
    browser = null;
    lastRequestTime = 0;
    constructor(siteName) {
        this.siteName = siteName;
        this.logger = new common_1.Logger(`${siteName}Scraper`);
        this.httpClient = axios_1.default.create({
            timeout: 30000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate, br',
                Referer: 'https://www.google.com/',
                'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
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
    async fetchHtml(url) {
        await this.respectRateLimit();
        try {
            this.logger.debug(`Fetching: ${url}`);
            const response = await this.httpClient.get(url);
            return cheerio.load(response.data);
        }
        catch (error) {
            this.logger.error(`Failed to fetch ${url}: ${error.message}`);
            throw error;
        }
    }
    async fetchWithBrowser(url) {
        await this.respectRateLimit();
        try {
            if (!this.browser) {
                this.browser = await playwright_1.chromium.launch({ headless: true });
            }
            const context = await this.browser.newContext({
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            });
            const page = await context.newPage();
            await page.goto(url, { waitUntil: 'networkidle' });
            return page;
        }
        catch (error) {
            this.logger.error(`Failed to fetch with browser ${url}: ${error.message}`);
            throw error;
        }
    }
    async closeBrowser() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }
    extractPrice(text) {
        if (!text)
            return 0;
        const cleaned = text.replace(/[৳$,\s]/g, '');
        const match = cleaned.match(/[\d.]+/);
        return match ? parseFloat(match[0]) : 0;
    }
    normalizeUrl(url) {
        if (!url)
            return '';
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
    normalizeProductData(raw) {
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
    async respectRateLimit() {
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
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    async retry(fn, maxRetries = 3) {
        let lastError = null;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await fn();
            }
            catch (error) {
                lastError = error;
                this.logger.warn(`Attempt ${attempt}/${maxRetries} failed: ${error.message}`);
                if (attempt < maxRetries) {
                    await this.sleep(1000 * attempt);
                }
            }
        }
        throw lastError || new Error('All retry attempts failed');
    }
}
exports.BaseScraper = BaseScraper;
//# sourceMappingURL=base-scraper.js.map