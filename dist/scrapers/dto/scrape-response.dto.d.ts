export declare class ScrapeResponseDto {
    jobId: string;
    sites: string[];
    status: string;
    message: string;
    startedAt: Date;
}
export declare class ScrapedProductsDto {
    products: any[];
    totalProducts: number;
    site: string;
    category?: string;
    page: number;
    scrapedAt: Date;
}
