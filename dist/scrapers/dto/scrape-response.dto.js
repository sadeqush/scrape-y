"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrapedProductsDto = exports.ScrapeResponseDto = void 0;
class ScrapeResponseDto {
    jobId;
    sites;
    status;
    message;
    startedAt;
}
exports.ScrapeResponseDto = ScrapeResponseDto;
class ScrapedProductsDto {
    products;
    totalProducts;
    site;
    category;
    page;
    scrapedAt;
}
exports.ScrapedProductsDto = ScrapedProductsDto;
//# sourceMappingURL=scrape-response.dto.js.map