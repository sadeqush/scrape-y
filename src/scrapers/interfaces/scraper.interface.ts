export interface ScraperConfig {
  baseUrl: string;
  selectors: {
    productList: string;
    productName: string;
    price: string;
    originalPrice?: string;
    imageUrl?: string;
    productUrl?: string;
    availability?: string;
    category?: string;
    brand?: string;
    sku?: string;
    [key: string]: string | undefined;
  };
  rateLimit: number; // Milliseconds between requests
  maxRetries?: number;
  timeout?: number;
}

export interface ProductData {
  name: string;
  price: number;
  brand: string;
  site: string;
  originalPrice?: number;
  url?: string;
  imageUrl?: string;
  inStock?: boolean;
  sku?: string;
  category?: string;
}

export interface IScraper {
  searchByBrand(brandName: string, maxPages?: number): Promise<ProductData[]>;
}
