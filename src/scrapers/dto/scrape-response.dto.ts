export class ScrapeResponseDto {
  jobId: string;
  site: string;
  status: string;
  message: string;
  startedAt: Date;
}

export class ScrapedProductsDto {
  products: any[];
  totalProducts: number;
  site: string;
  category?: string;
  page: number;
  scrapedAt: Date;
}
