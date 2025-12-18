export class ProductDto {
  name: string;
  sku: string;
  price: number;
  originalPrice?: number;
  currency: string;
  description?: string;
  imageUrl?: string;
  productUrl: string;
  site: string;
  inStock: boolean;
  specifications?: Record<string, string>;
  category: string;
  brand?: string;
  scrapedAt: Date;
}
